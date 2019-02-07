module.exports = function(mailbot) {
  /**
   * mailbot.loadSkill loads every handler in a specified directory (including this one)
   *
   * Usually place one handler per file, unless they are short
   * and closely related.
   */
  mailbot.onCommand("hello", bot => {
    try {
      // throw new Error("foo!");
      bot.webhook.quickReply("hi");
      bot.webhook.respond();
    } catch (e) {
      // by catching errors in the handler we can log the error and
      // send someone an email letting them know
      bot.skills.logger.log("Hello command caught an error: " + e.message);
      bot.webhook.sendEmail({
        to: bot.get("source.from"),
        subject: "An error happened",
        body: [{ type: "html", text: `The error was ${e.message}` }]
      });
      bot.webhook.respond();
    }
  });
};
