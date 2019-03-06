const MailBots = require("mailbots");
const mailbot = new MailBots();
const loggerMiddleware = require("./lib/middleware/logger");

// Explicitly load middleware in the top level so avoid hidden magic
// See https://github.com/mailbots/mailbots#middleware
mailbot.app.use(loggerMiddleware);

// Try to catch errors within each handler. Worst case they fall back to this
mailbot.setErrorHandler((err, bot) => {
  console.log("\nCaught error in top-level. Try to handle errors earlier\n");
  bot.skills.logger.log("Log top-level error here"); // set up within loggerMiddleware above
  bot.webhook.respond();
});

// Explicitly load handler directory for each module
// See https://github.com/mailbots/mailbots#using-handlers
mailbot.loadSkill(__dirname + "/lib/hello-world/handlers");
// For a simpler project you can put all your handlers in one
// directoy (ex: "skills") and load them in one call.  Because
// this is a "big bot", we are organized into modules. It's
// the node.js way:  https://github.com/i0natan/nodebestpractices#-11-structure-your-solution-by-components

// Set in package.json
if (process.env.NODE_ENV !== "testing") {
  mailbot.listen();
}

// See tests
module.exports = mailbot.exportApp();
