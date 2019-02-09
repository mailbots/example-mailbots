exports.getFailureEmail = function(bot) {
  const shoppingEmail = {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: "I didn't catch that...",
    body: [
      {
        type: "text",
        text: `I can't understand these words. :(`
      },
      {
        type: "spacer"
      }
    ]
  };
  return shoppingEmail;
};

exports.getSuccessEmail = function({ bot, searchUrl, searchPhrases }) {
  return {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: bot.get("task.reference_email.subject"),
    body: [
      {
        type: "text",
        text: `Here's your shopping link!`
      },
      {
        type: "button",
        behavior: "url",
        text: `Go shopping!`,
        url: searchUrl
      },
      {
        type: "spacer"
      }
    ]
  };
};
