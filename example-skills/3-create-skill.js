module.exports = function(gopherApp) {
  
  // Skill authoring is a more avanced 
  // A custom skill that logs the users email any webhook
  function logUserEmail(request, response, next) {
    var gopher = response.locals.gopher;
    
    // Gopher this "logUserEmail" skill is now available
    gopher.skills.logUserEmail = function() {
      var userEmail = gopher.getReplyto();
      console.log(userEmail);
    }
    next();
  }
  
  gopherApp.use(logUserEmail);
}