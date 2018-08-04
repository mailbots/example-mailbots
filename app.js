// Load the Gopher Module
require("dotenv").config();
var GopherApp = require("gopher-app");
var gopherApp = new GopherApp();

// Create gopherSkills right in the the main file...
gopherApp.onCommand("hello", function(gopher) {
  gopher.webhook.addEmail({
    to: gopher.get("source.from"),
    subject: "Hello World: The simplest way to trigger a reminder"
  });
  gopher.webhook.respond();
});

// ...or load them from a directory
gopherApp.loadSkills(__dirname + "/example-skills/");

// Start Gopher listening (call this last)
gopherApp.listen();
