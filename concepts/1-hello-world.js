// Exports your MailBots Skill (A Node.js convention)
module.exports = function(mailbot) {
  /**
   *  Send an email to "hello@your-subdomain.eml.bot"
   *  to trigger this function. This is an example of an
   *  Email Command.
   */

  mailbot.onCommand("hello-world", function(bot) {
    /**
     * Your function is passed a "bot" that comes pre-loaded
     * with skills and information to get stuff done. For example
     * let's send an email:
     */
    bot.webhook.sendEmail({
      to: bot.get("source.from"), // Send to the "from" address
      subject: `Hello ${bot.get("source.from")}!`,
      body: [
        {
          type: "html",
          text: `<p>MailBots received your email and sent a webhook to your 
          mailbot. Your mailbot then responded with JSON that told MailBots
          to send this email.</p>

          <img src="https://files.readme.io/2bfee74-gopher-req-res.png" width="100%" border="0"/>
          
          <p>View the source code for your mailbot and read the comments. You can also 
          view our <a href="https://docs.mailbots.com/v1.0/reference#email-ui-component-reference">documentation</a>. 
          </p>`
        }
      ]
    });

    /**
     * MailBots reports back, completing your skill handling.
     */
    bot.webhook.respond();
  });

  // End of exported function
};
