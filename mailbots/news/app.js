require("dotenv").config();
const MailBots = require("mailbots");
const mailbot = new MailBots();
const MailBotsAPI = require("@mailbots/mailbots-sdk");
const { getProductHuntEmail } = require("./emails");

/**
 * Send the newsletter every time the reminder triggers.
 * Pro Tip! Use the Sandbox to simulate a task being triggered
 */
mailbot.onTrigger("producthunt-weekly", function(bot) {
  // Pull from Product Hunt API Mail Bots, then render email
  bot.webhook.sendEmail(getProductHuntEmail(bot));
  bot.webhook.respond();
});

/**
 * Send the email email when emailing producthunt@your-bot.eml.bot
 * because it's easy to see in Sandbox, and..why not??
 */
mailbot.onCommand("producthunt", function(bot) {
  // Pull from Product Hunt API Mail Bots, then render email
  const email = bot.webhook.sendEmail(getProductHuntEmail(bot));
  bot.webhook.respond();
});

/**
 * Handle when the task is viewed on MailBots.com
 * Note that this would actually pull the products from Product Hunt
 * at the moment is is loaded. The Action Emails would work all the same.
 */
mailbot.onTaskViewed("producthunt-weekly", function(bot) {
  // Pull from Product Hunt API Mail Bots, render email
  bot.webhook.sendEmail(getProductHuntEmail(bot));
  bot.webhook.respond();
});

/**
 * A daily subscription could be done using a different command.
 * This allows us to handle a different view, which may call for
 * different productsc to be loaded and a different style of email.
 */
mailbot.onTaskViewed("producthunt-daily", function(bot) {
  // Pull from Product Hunt API Mail Bots, render email
  bot.webhook.sendEmail(getProductHuntEmail(bot));
  bot.webhook.respond();
});

/**
 * The subscription is set simply by creating a recurring task with a specific
 * command "producthunt-weekly" in our case.
 *
 * This is shown here for demonstration, but would be better accomplished in
 * a settings workflow. After installing, the user is taken to settings/welcome,
 * at which point they are asked to authorize their ProductHunt account (or insert API key),
 * and ask for their frequency preference. The task could be created in the
 * https://mailbots-app.mailbots.com/#beforesettingssaved handler, as in the todo MailBot.
 *
 * To test this method, Uninstall / reinstall it from the directoy page to re-fire this webhook.
 */
mailbot.on("mailbot.installed", async function(bot) {
  const mbClient = MailBotsAPI.fromBot(bot);
  const res = await mbClient.createTask({
    task: {
      command: `producthunt-weekly@${bot.config.mailDomain}`,
      trigger_timeformat: "everyFriday4pm", // see onTrigger method above
      reference_email: [
        {
          subject: "Prodct Hunt Weekly",
          html: "Delete this task to remove your weekly subscription"
        }
      ]
    }
  });
  console.log(res.task);

  bot.webhook.respond({
    webhook: { staus: "success", message: "Product Hunt subscription created" }
  });
});

mailbot.listen();
