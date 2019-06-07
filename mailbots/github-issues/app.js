require("dotenv").config();
const MailBots = require("mailbots");
const mailbot = new MailBots();
const MailBotsApi = require("@mailbots/mailbots-sdk");
const { oauthLoginUrl } = require("@octokit/oauth-login-url");
const { getGithubEmail } = require("./emails");
const axios = require("axios");
const qs = require("querystring");
const GitHub = require("github-api");

const onComment = require("./onComment");
const onAssignSelf = require("./onAssignSelf");
const onClose = require("./onClose");
const onLabel = require("./onLabel");
const onRemind = require("./onRemind");
const markdown = require("./markdown");
const onCreate = require("./onCreate");
const onAddIssue = require("./onAddIssue");

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
mailbot.onEvent("github", async function (bot) {
  const githubAction = bot.get("payload.body_json.action");

  // when an issue is closed, try to see if we have
  // a task for it and mark it as complete
  if (githubAction === "closed") {
    const issueInfo = bot.get("payload.body_json");
    const mbClient = MailBotsApi.fromBot(bot);
    const result = await mbClient.getTasks({ search_key: issueInfo.issue.number });
    const task = result.tasks[0];
    if (task) {
      await mbClient.completeTask({ task: { id: task.id } });
    }
  }

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
      command: `github@${bot.config.mailDomain}`,
      search_keys: [issueInfo.issue.number]
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
mailbot.onAction("label.feature", onLabel("feature"));
mailbot.onAction("label.wishlist", onLabel("wishlist"));
mailbot.onAction("label.urgent", onLabel("urgent"));
mailbot.onAction("label.bug", onLabel("bug"));
mailbot.onAction("remind.3days", onRemind("3days"));
mailbot.onAction("remind.tomorrow", onRemind("tomorrow"));
mailbot.onAction("remind.nextWeek", onRemind("nextWeek"));
mailbot.onAction("remind.nextMonth", onRemind("nextMonth"));

mailbot.onTrigger("github", bot => {
  // complete this task
  const issueInfo = bot.get("task.stored_data.issueInfo");
  bot.webhook.sendEmail(
    getGithubEmail(bot.get("task.reference_email.from"), issueInfo)
  );
  bot.webhook.respond();
});

mailbot.onCommand("create", onCreate);
mailbot.onAction(/addissueto.*/, onAddIssue);

/******************************************************************************************
 *                                      Settings
 *                      https://docs.mailbots.com/reference#mailbot-settings
 *****************************************************************************************/

mailbot.onSettingsViewed(async function (bot) {
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

    mySettingsPage.text(markdown.reposPickDescriptionText);
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
      scopes: ["repo"],
      state: String(Date.now())
    });
    mySettingsPage.text(markdown.notAuthorizedText);
    mySettingsPage.text(`[Begin GitHub OAuth](${oauth.url})`);
  }
});

mailbot.beforeSettingsSaved(async bot => {
  try {
    const settings = bot.get("settings.github_repos");
    const reposToInstall = Object.keys(settings).filter(r => settings[r]);
    const botData = bot.webhook.getMailBotData();
    const github = new GitHub({
      token: botData.github.token.access_token
    });
    const me = github.getUser();
    const { data: profile } = await me.getProfile();
    const alreadyInstalledRepos = botData.installed_repos || [];
    const eventUrl = bot.get("mailbot.event_url");

    // install hooks for newly selected repos
    for (let repoName of reposToInstall) {
      const repo = github.getRepo(profile.login, repoName);
      if (!alreadyInstalledRepos.some(r => r === repoName)) {
        // create the webhook
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

    // uninstall hooks for deselected repos
    const reposToUninstall = alreadyInstalledRepos.filter(
      r => !reposToInstall.includes(r)
    );
    for (let repoName of reposToUninstall) {
      const repo = github.getRepo(profile.login, repoName);
      const { data: hooks } = await repo.listHooks();

      // check which hook matches our url
      const ownHook = hooks.find(h => h.config.url.includes(eventUrl));
      if (ownHook) {
        await repo.deleteHook(ownHook.id);
      }
    }

    bot.webhook.setMailBotData("installed_repos", reposToInstall);

    // workaround for the settings save bug
    bot.webhook.setMailBotData("github_repos", bot.get("settings.github_repos"));
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

/******************************************************************************************
 *                                      Lifecycle hooks
 *                      https://docs.mailbots.com/reference#webhooks
 *****************************************************************************************/

mailbot.on("mailbot.uninstalled", async bot => {
  try {
    const botData = bot.webhook.getMailBotData();
    const github = new GitHub({
      token: botData.github.token.access_token
    });
    const me = github.getUser();
    const { data: profile } = await me.getProfile();

    // uninstall active hooks
    const alreadyInstalledRepos = botData.installed_repos || [];
    const eventUrl = bot.get("mailbot.event_url");
    for (let repoName of alreadyInstalledRepos) {
      const repo = github.getRepo(profile.login, repoName);
      const { data: hooks } = await repo.listHooks();

      // check which hook matches our url
      const ownHook = hooks.find(h => h.config.url.includes(eventUrl));
      if (ownHook) {
        await repo.deleteHook(ownHook.id);
      }
    }

    bot.webhook.respond();
  } catch (error) {
    return bot.webhook.respond({
      webhook: {
        status: "error",
        message: error.message
      }
    });
  }
});

mailbot.listen();
