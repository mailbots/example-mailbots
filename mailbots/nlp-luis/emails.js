exports.getFailureEmail = function(bot) {
  const shoppingEmail = {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: "Me not so smart",
    body: [
      {
        type: "html",
        text: `<p>I can't understand these words. :(</p>`
      },
      {
        type: "section"
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
        type: "html",
        text: `<p>Here's your shopping link!</p>`
      },
      {
        type: "button",
        text: `Go shopping!`,
        url: searchUrl
      },
      {
        type: "section"
      }
    ]
  };
};
