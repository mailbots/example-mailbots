module.exports = function(mailbot) {
  /**
   * MailBots Skills can be published as NPM modules. For example,
   * this skill automatically set reminders for a task using
   * spaced repetition - a memorization technique that sets
   * reminders at increatingly longer intervals each time.
   * Skills can connect to APIs, set reminders, export custom
   * UI elements and handle their own settings.
   */
  // var memorize = require("@mailbots/skill-memorize")(mailbot);

  mailbot.onCommand("remember", function(bot) {
    // @TODO: Roll back memorize skill to simpler version. Release here.
    return;
    memorize.memorizeTask(bot);
    bot.webhook.sendEmail({
      to: bot.get("source.from"),
      from: "MailBots Remember",
      subject: bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>This email shows the use of an MailBots Skill 
          that was installed from npm called "@mailbots/skill-memorize". This 
          skill sets the trigger schedule of any task at increasing 
          intervals, optimized for memorization.</p>
          <p>Trigger the task task via the sandbox to see this
          triggering in action. View source to see how it's done.</p>
          <hr />`
        },
        ...memorize.renderMemorizationControls(bot),
        {
          type: "section"
        },
        {
          type: "title",
          text: bot.get("task.reference_email.subject")
        }
      ]
    });
    bot.webhook.respond();
  });

  mailbot.on("task.triggered", function(bot) {
    memorize.memorizeTask(bot);
    bot.webhook.sendEmail({
      to: bot.get("source.from"),
      from: "MailBots Memorize",
      subject: bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>Use the Sandbox to continue to trigger this
          task. Watch as the reminder intervals get further 
          and further apart with each trigger</p><hr />`
        },
        {
          type: "title",
          text: bot.get("task.reference_email.subject")
        },
        ...memorize.renderMemorizationControls(bot)
      ]
    });
    bot.webhook.respond();
  });
};
