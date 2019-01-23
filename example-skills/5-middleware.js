module.exports = function(mailbot) {
  /**
   * This is a custom skill that logs the users email any webhook. It is
   * written here as a stand-alone function, but it could just as easily be
   * packaged and distributed as an npm module.
   */
  function logUserEmail(request, response, next) {
    var bot = response.locals.bot;

    // Add the "logUserEmail" skill to MailBots
    bot.skills.logUserEmail = function() {
      var userEmail = bot.getReplyto();
      console.log(userEmail);
    };
    next();
  }

  // Middleware would be exported and "used" at a higher level so its use is clear and explicit.
  // It is being both defined and "used" here to show how it works.
  mailbot.app.use(logUserEmail);
  // After "use" of this middlware, subsequent handlers now log the user's email
};
