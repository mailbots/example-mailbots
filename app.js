// Load the Gopher Module
require("dotenv").config();
var MailBots = require("mailbots");
var mailbot = new MailBots();

// Create gopherSkills right in the the main file...
mailbot.onCommand("hello", function(bot) {
  bot.webhook.addEmail({
    to: bot.get("source.from"),
    subject: "Hello World: The simplest way to trigger a reminder"
  });
  bot.webhook.respond();
});

// ...or load them from a directory
mailbot.loadSkill(__dirname + "/example-skills/");

// Start Gopher listening (call this last)
mailbot.listen();
