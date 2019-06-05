require("dotenv").config();
const MailBots = require("mailbots");
const mailbot = new MailBots();
const MailBotsApi = require("@mailbots/mailbots-sdk");
const { oauthLoginUrl } = require('@octokit/oauth-login-url');
const { getGithubEmail } = require("./emails");
const axios = require('axios');
const qs = require('querystring');
const GitHub = require('github-api');

const onComment = require("./onComment");
const onAssignSelf = require("./onAssignSelf");
const onClose = require("./onClose");
const onLabel = require("./onLabel");
const onRemind = require("./onRemind");

const githubCredentials = {
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  redirectUri: process.env.GITHUB_OAUTH_REDIRECT_URI
};

/**
 * GitHub OAuth flow
 */
mailbot.app.get("/oauth-callback", async (req, res) => {
  try {
    console.log(req.query);

    // exchange code for access token
    const url = `https://github.com/login/oauth/access_token`;
    const result = await axios.post(url, {
      client_id: githubCredentials.clientId,
      client_secret: githubCredentials.clientSecret,
      code: req.query.code,
      state: req.query.state
    });

    const token = qs.parse(result.data);
    const mbClient = new MailBotsApi();
    await mbClient.setAccessToken(req.cookies.access_token);
    await mbClient.saveBotData({
      github: {
        token
      }
    });

    const bot = res.locals.bot; // bot lives here
    res.redirect(`${bot.config.mailbotSettingsUrl}/success`);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

/**
 * Create a MailBots task when a Github issue is opened.
 */
mailbot.onEvent("github", async function(bot) {
  // In the Sandbox, adjust your filter to view API calls to see this API call
  // This creates a task and sends an email at the same time.

  const githubAction = bot.get("payload.body_json.action");

  if (githubAction !== "opened") {
    // a different event has occured
    return bot.webhook.respond();
  }

  // a new issue has been opened, so proceed
  const mbClient = MailBotsApi.fromBot(bot);
  const issueInfo = bot.get("payload.body_json");
  const createTaskParams = {
    verbose: 1,

    task: {
      stored_data: {
        issueInfo
      },
      command: `github@${bot.config.mailDomain}`
    },
    send_messages: [getGithubEmail(bot.get("source.from"), issueInfo)] // send an email when creating the task
  };

  try {
    await mbClient.createTask(createTaskParams);
  } catch (e) {
    console.error(e);
  }
  bot.webhook.respond();
});

// here comes the interesting part - those functions execute the actual github integration
mailbot.onAction("comment", onComment);
mailbot.onAction("github.close", onClose);
mailbot.onAction("assign.self", onAssignSelf);
mailbot.onAction("label.bug", onLabel("bug"));
mailbot.onAction("label.feature", onLabel("feature"));
mailbot.onAction("label.wishlist", onLabel("wishlist"));
mailbot.onAction("label.urgent", onLabel("urgent"));
mailbot.onAction("remind.3days", onRemind("3days"));
mailbot.onAction("remind.tomorrow", onRemind("tomorrow"));
mailbot.onAction("remind.nextWeek", onRemind("nextWeek"));
mailbot.onAction("remind.nextMonth", onRemind("nextMonth"));

mailbot.onTrigger('github', bot => {
  // complete this task
  const issueInfo = bot.get("task.stored_data.issueInfo");
  bot.webhook.sendEmail(getGithubEmail(bot.get("task.reference_email.from"), issueInfo));
  bot.webhook.respond();
});

/******************************************************************************************
 *                                      Settings
 *                      https://docs.mailbots.com/reference#mailbot-settings
 *****************************************************************************************/

mailbot.onSettingsViewed(async function(bot) {

//   mySettingsPage.text(`
// ### How To Connect GitHub
// When a user installs your MailBot, they are taken the settings page for your extension (this page).

// Here, you can ask them to connect their GitHub account, or manually configure GitHub's webhooks
// to point to their unique MailBot event URL which, in your case, is \`${bot.get(
//     "mailbot.event_url"
//   )}\` in this case. The "type" of the event used in the handler is passed in the URL. \`?type=github.issue.created\`.

//   [More about event triggering](https://docs.mailbots.com/reference#event-triggering)
// `);

  const botData = bot.webhook.getMailBotData();
  if (botData.github) {
    const mySettingsPage = bot.webhook.settingsPage({
      namespace: "github_repos",
      title: "GitHub Repositories Integration Settings",
      menuTitle: "GitHub Repos"
    });

    const github = new GitHub({
      token: botData.github.token.access_token
    });
    const me = github.getUser();
    const repos = await me.listRepos();

    mySettingsPage.text(
`#### Choose the repositories that you want to use with this mailbot`
    );
    repos.data.forEach(repo => {
      mySettingsPage.checkbox({
        name: repo.name,
        title: repo.name,
        description: repo.description || "Repository without description"
      });
    });

    mySettingsPage.submitButton();

    mySettingsPage.populate(bot.webhook.getMailBotData("github_repos")); // Populate form values
  } else {
    const mySettingsPage = bot.webhook.settingsPage({
      namespace: "github_oauth",
      title: "GitHub Integration Settings",
      menuTitle: "GitHub OAuth"
    });
    const oauth = oauthLoginUrl({
      clientId: githubCredentials.clientId,
      redirectUri: githubCredentials.redirectUri,
      scopes: ['repo'],
      state: String(Date.now()),
    });
    mySettingsPage.text(`[Begin GitHub OAuth](${oauth.url})`);
  }
});

mailbot.beforeSettingsSaved(async bot => {
  try {
    // assuming the same "todo" namespace as shown in the above examples
    const repos = bot.get("settings.github_repos");
    if (repos) {
      const botData = bot.webhook.getMailBotData();
      const github = new GitHub({
        token: botData.github.token.access_token
      });
      const me = github.getUser();
      const { data: profile } = await me.getProfile();
      for (let repoName in repos) {
        const repo = github.getRepo(profile.login, repoName);

        // create the webhook
        const eventUrl = bot.get("mailbot.event_url");
        await repo.createHook({
          name: "web",
          config: {
            url: `${eventUrl}?type=github`,
            content_type: "json"
          },
          events: ["issues"]
        });
      }
    }
  } catch (error) {
    console.error(error);
    return bot.webhook.respond({
      webhook: {
        status: "error",
        message: error.message
      }
    });
  }
});

mailbot.on("mailbot.uninstalled", bot => {
  bot.webhook.respond();
});

mailbot.listen();
