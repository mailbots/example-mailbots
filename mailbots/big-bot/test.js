module.exports = function(mailbot) {
  mailbot.onCommand("foo", bot => {
    bot.webhook.respond({ webhook: { message: "bar" } });
  });
};
