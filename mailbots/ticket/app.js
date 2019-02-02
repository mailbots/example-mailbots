require('dotenv').config();
const MailBots = require('mailbots');
const mailbot = new MailBots();
const MailBotsApi = require('@mailbots/mailbots-sdk');
const { getGithubEmail } = require('./emails');

/**
 * Create a MailBots task when a Github issue is opened.
 *
 * Copy / paste the github example webhook payload...
 * https://developer.github.com/v3/activity/events/types/#issuesevent
 * ...into the "Event" dropdown in the Sandbox.
 * Name the event "github.issue.opened"
 *
 * NOTE: For this to actually work, you would need to first set up Github to post to your
 * mailbot's event_url. This is mainly to demonstrate how the
 * event system works. Also, the Sandbox does not yet show email previews
 * of tasks created by the API (as shown below).
 */
mailbot.onEvent('github.issue.opened', async function(bot) {
  // In the Sandbox, adjust your filter to view API calls to see this API call
  // This creates a task and sends an email at the same time.
  const mbClient = MailBotsApi.fromBot(bot);
  const createTaskParams = {
    verbose: 1,
    task: {
      command: `github@${bot.config.mailDomain}`
    },
    send_messages: [getGithubEmail(bot)] // send an email when creating the task
  };

  try {
    await mbClient.createTask(createTaskParams);
  } catch (e) {
    console.error(e);
  }
  bot.webhook.respond();
});

mailbot.onCommand('github', function(bot) {
  bot.webhook.addEmail(getGithubEmail(bot));
  bot.webhook.respond();
});

// Handle when a user views a github task on mailbots.com
mailbot.onTaskViewed('github', function(bot) {
  // Pull the latest ticket info via github API. Send it in an email to the user using the same template as above.
  bot.webhook.addEmail(getGithubEmail(bot));
  bot.webhook.respond();
});

// When a task reminder triggers we send an email to the user (note this is identical to the viewing logic above)
mailbot.onTrigger('github', function(bot) {
  // Pull the latest ticket info via github API. Send it in an email to the user using the same template as above.
  bot.webhook.addEmail(getGithubEmail(bot));
  bot.webhook.respond();
});

/******************************************************************************************
 *                                      Action Emails
 *                      https://docs.mailbots.com/reference#action-emails
 *****************************************************************************************/

// Close the Github issue
mailbot.onAction('github.close', function(bot) {
  // use Github API to close the issue
  const reply = `Issue would be closed via GitHub API`;
  bot.webhook.quickReply(reply);
  bot.set('webhook.status', 'info');
  bot.set('webhook.message', reply);
  bot.webhook.respond();
});

// Handle the email action to close the Github issue
mailbot.onAction(/label.*/, function(bot) {
  // use Github API to close the issue
  const label = bot.get('action.format', '').split('.')[1];
  const reply = `This would be labeled "${label}"`;
  bot.webhook.quickReply(reply);
  bot.set('webhook.status', 'info');
  bot.set('webhook.message', reply);
  bot.webhook.respond();
});

// Handle the email action to close the Github issue
mailbot.onAction(/assign.*/, function(bot) {
  // use Github API to close the issue
  const assignee = bot.get('action.format', '').split('.')[1];
  const reply = `${assignee} would have been assigned`;
  bot.webhook.quickReply(reply);
  bot.set('webhook.status', 'info');
  bot.set('webhook.message', reply);
  bot.webhook.respond();
});

// Handle the email action to close the Github issue
mailbot.onAction(/remind.*/, function(bot) {
  // No interaction with the github API would be needed
  const reminderTimeFormat = bot.get('action.format', '').split('.')[1];
  const reply = `${assignee} would have been assigned`;
  bot.webhook.setTriggerTime(reminderTimeFormat); // Sets this task into the future...
  bot.webhook.quickReply(reply);
  bot.set('webhook.status', 'info');
  bot.set('webhook.message', reply);
  bot.webhook.respond();
});

/******************************************************************************************
 *                                      Settings
 *                      https://docs.mailbots.com/reference#mailbot-settings
 *****************************************************************************************/

mailbot.onSettingsViewed(function(bot) {
  const mySettingsPage = bot.webhook.settingsPage({
    namespace: 'github',
    title: 'GitHub Integration Settings',
    menuTitle: 'GitHub'
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

  /**
   * Save user settings. See the todo MailBot example.
   */
  mailbot.beforeSettingsSaved(function(bot) {
    // save settings here...see todo project for an example
  });
});

mailbot.listen();
