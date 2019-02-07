const { logger } = require("../helpers");

// Create apache-like log event...
function createServerLog(req) {
  const d = new Date();
  return `${d.toISOString()} ${req.ip} ${req.method} ${req.originalUrl}`;
}

/**
 * Logs every request in apache-like format
 * Adds logger to bot.skills.logger so logger is available for every
 * subsequent request
 */
module.exports = function(req, res, next) {
  const bot = res.locals.bot;
  bot.skills = bot.skills || {};
  bot.skills.logger = logger;

  // If it's a webhook, set session information to track logs for user events
  // if (bot.requestJson) {
  // bot.skills.logger.setContextFromWebhook(bot.requestJson); // theoretical
  // }

  // Log generic request
  bot.skills.logger.log(createServerLog(req));

  next(); // Don't forget to call this...otherwise you will by left in silent mystery (try it)
};
