module.exports = function(gopherApp) {
  /**
   * This is a custom skill that logs the users email any webhook. It is
   * written here as a stand-alone function, but could ust as easily be
   * installed and used as an npm module.
   */
  function logUserEmail(request, response, next) {
    var gopher = response.locals.gopher;

    // Add the "logUserEmail" skill to Gopher
    gopher.skills.logUserEmail = function() {
      var userEmail = gopher.getReplyto();
      console.log(userEmail);
    };
    next();
  }

  // Adds the Gopher Skill, making it available for all subsequent skills
  gopherApp.app.use(logUserEmail);
};
