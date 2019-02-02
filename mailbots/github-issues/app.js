require('dotenv').config();
const MailBots = require('mailbots');
const mailbot = new MailBots();
const MailBotsApi = require('@mailbots/mailbots-sdk');
const { getGithubEmail } = require('./emails');

const onComment = require('./onComment');
const onAssignSelf = require('./onAssignSelf');
const onClose = require('./onClose');
const onLabel = require('./onLabel');

/**
 * Create a MailBots task when a Github issue is opened.
 */
mailbot.onEvent('github', async function(bot) {
  // In the Sandbox, adjust your filter to view API calls to see this API call
  // This creates a task and sends an email at the same time.

  const githubAction = bot.get('payload.body_json.action');

  if (githubAction !== 'opened') {
    // a different event has occured
    return;
  }

  // a new issue has been opened, so proceed
  const mbClient = MailBotsApi.fromBot(bot);
  const createTaskParams = {
    verbose: 1,

    task: {
      stored_data: {
        issueInfo: bot.get('payload.body_json'),
      },
      command: `github@${bot.config.mailDomain}`,
    },
    send_messages: [getGithubEmail(bot)], // send an email when creating the task
  };

  try {
    await mbClient.createTask(createTaskParams);
  } catch (e) {
    console.error(e);
  }
  bot.webhook.respond();
});

// here comes the interesting part - those functions execute the actual github integration
mailbot.onAction('comment', onComment);
mailbot.onAction('github.close', onClose);
mailbot.onAction('assign.self', onAssignSelf);
mailbot.onAction('label.feature', onLabel('feature'));
mailbot.onAction('label.wishlist', onLabel('wishlist'));
mailbot.onAction('label.urgent', onLabel('urgent'));
mailbot.onAction('label.bug', onLabel('bug'));

/******************************************************************************************
 *                                      Settings
 *                      https://docs.mailbots.com/reference#mailbot-settings
 *****************************************************************************************/

mailbot.onSettingsViewed(function(bot) {
  const mySettingsPage = bot.webhook.settingsPage({
    namespace: 'github',
    title: 'GitHub Integration Settings',
    menuTitle: 'GitHub',
  });

  mySettingsPage.text(`
### How To Connect GitHub
When a user installs your MailBot, they are taken the settings page for your extension (this page).

Here, you can ask them to connect their GitHub account, or manually configure GitHub's webhooks  
to point to their unique MailBot event URL which, in your case, is \`${bot.get(
    'mailbot.event_url'
  )}\` in this case. The "type" of the event used in the handler is passed in the URL. \`?type=github.issue.created\`.

  [More about event triggering](https://docs.mailbots.com/reference#event-triggering)
`);

  mySettingsPage.input({
    name: 'github_token',
    title: 'Github token',
  });

  mySettingsPage.submitButton();

  mySettingsPage.populate(bot.webhook.getMailBotData('github')); // Populate form values
  // Note bot.webhook.respond() is NOT called
});

mailbot.listen();
