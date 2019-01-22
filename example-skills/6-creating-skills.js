module.exports = function(mailbot) {
  /**
   * This is a custom skill that logs the users email any webhook. It is
   * written here as a stand-alone function, but could ust as easily be
   * installed and used as an npm module.
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

  // Adds the MailBots Skill, making it available for all subsequent skills
  mailbot.app.use(logUserEmail);
};
