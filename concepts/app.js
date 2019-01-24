require("dotenv").config();
var MailBots = require("mailbots");
var mailbot = new MailBots();

// When someone sends "hello@your-bot.eml.bot", do this
mailbot.onCommand("hello", function(bot) {
  bot.webhook.quickReply("Hello world!");
  bot.webhook.respond();
});

// Load skills
mailbot.loadSkill(__dirname + "/concepts/");

// Start listening for requests
mailbot.listen();
