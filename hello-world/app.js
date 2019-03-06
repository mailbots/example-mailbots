require("dotenv").config();
const MailBots = require("mailbots");
const mailbot = new MailBots(); // load from .env or ...
// const mailbot = new MailBots({ clientId: "", clientSecret: "" });

//  Email: "hello@your-bot.eml.bot"
mailbot.onCommand("hello", function(bot) {
  bot.webhook.quickReply("Hello world!");
  bot.webhook.respond();
});

// Start listening for requests
mailbot.listen();
