exports.getFailureEmail = function(bot) {
  const shoppingEmail = {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: "I didn't catch that...",
    body: [
      {
        type: "text",
        text: `Sorry, I didn't quite catch that.`
      },
      {
        type: "spacer"
      }
    ]
  };
  return shoppingEmail;
};

exports.getFindItemEmail = function({ bot, searchUrl, searchPhrases }) {
  return {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: "Re: " + bot.get("task.reference_email.subject"),
    body: [
      {
        type: "text",
        text: `Here is good selection of ${searchPhrases[0]}`
      },
      {
        type: "button",
        behavior: "url",
        text: `Shop For ${searchPhrases[0]}`,
        url: searchUrl
      },
      {
        type: "spacer"
      },
      {
        type: "html",
        html: `<pre>Output from LUIS: \n\n ${JSON.stringify(
          bot.skills.luis,
          null,
          4
        )} </pre>`
      }
    ]
  };
};

exports.getBuyItemEmail = function({ bot, searchUrl, searchPhrases }) {
  return {
    to: bot.get("source.from"),
    from: "MailBots NLP Shopping",
    subject: "Re: " + bot.get("task.reference_email.subject"),
    body: [
      {
        type: "text",
        text: `Here is a link where you can buy ${searchPhrases[0]}`
      },
      {
        type: "button",
        behavior: "url",
        text: `Buy ${searchPhrases}`,
        url: searchUrl
      },
      {
        type: "spacer"
      },
      {
        type: "html",
        html: `<pre>Output from LUIS: \n\n ${JSON.stringify(
          bot.skills.luis,
          null,
          4
        )} </pre>`
      }
    ]
  };
};
