require("dotenv").config();
const _ = require('lodash');
const MailBots = require('mailbots');
const mailbot = new MailBots();

// Include the middleware to provide bot.subjectIntent and bot.bodyIntent
require('./mailbots-nlp-middleware')(mailbot);

function getFailureEmail(bot) {
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
}

function getSuccessEmail(bot, searchUrl) {
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
        text: "Go shopping!",
        url: searchUrl
      },
      {
        type: "section"
      }
    ]
  };  
  
}

// When someone sends "shop@your-bot.eml.bot", do this
mailbot.onCommand("shop", function(bot) {
        
  const topScoringIntent = bot.subjectIntent.topScoringIntent.intent;
  
  // Only consider entities which are likely
  const likelyEntities = _.find(bot.subjectIntent, function(entity) {
    return entity.score > .5;
  });
  
  // We're only doing FindItem right now.
  if (_.get(bot.subjectIntent, 'topScoringIntent.intent') != 'Shopping.FindItem') {
    bot.webhook.addEmail(getFailureEmail(bot));
    return bot.webhook.respond();
  }
  
  const keyPhrase = _.find(bot.subjectIntent.entities, {type: 'builtin.keyPhrase'}, null);
  const rating = _.find(likelyEntities, {type: 'Shopping.Rating'}, null);
  
  // If we don't have a keyphrase send the failure email and return
  if (!keyPhrase) {
    bot.webhook.addEmail(getFailureEmail(bot));
    return bot.webhook.respond();
  }

  let searchString = keyPhrase.entity;
  
  let searchUrl = 'https://www.amazon.com/s/?field-keywords=' + encodeURIComponent(searchString);
  let sort = '';
  
  if (rating) {
    // Incase we have other entities we want to sort on we'll rank them and use the highest confidence
    const confidenceSorted = _.sortBy([rating], 'score');
    const sortBy = confidenceSorted[0]
    
    switch (sortBy.type) {
      case 'Shopping.Rating':
        sort = '&sort=review-rank';
        break;
    }
  }
  
  searchUrl += sort;

  // Send the email with the shopping button.
  bot.webhook.addEmail(getSuccessEmail(bot, searchUrl));
  bot.webhook.respond();
});

// Start listening for requests
mailbot.listen();
