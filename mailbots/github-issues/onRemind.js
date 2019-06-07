module.exports = time => {
  return bot => {
    bot.webhook.setTriggerTime(time);
    bot.webhook.respond();
  };
};
