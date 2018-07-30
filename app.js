// Load the Gopher Module
var GopherApp = require("gopher-app");
var gopherApp = new GopherApp();


// Create gopherSkills right in the the main file...
gopherApp.onCommand(/.*/, function(gopher) {
  gopher.webhook.addEmail({
    to: gopher.get("source.from"),
    subject: "Hello World"
  });
  gopher.webhook.respond();
});

// ...or load them from a directory
gopherApp.loadSkills(__dirname + "/example-skills/") 

// Start Gopher listening (call this last)
gopherApp.listen();