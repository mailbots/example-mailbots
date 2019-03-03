Mailbots is a platform to create bots, AIs and assistants that get things done right from your inbox. Read more at [https://www.mailbots.com](mailbots.com).

## Luis.ai NLP Example

This demo uses the [MailBots LUIS skill](https://www.npmjs.com/package/@mailbots/luis-ai) to parse and extract meaning from email. A simple example is provided, but luis.ai has built-in knowledge of numerous domains and entities. With some simple modifications
you can extract places, dates, times and locations anre more. [Luis.ai docs](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/).

## Using This MailBot

Send an email to `shop@your-bot-address.eml.bot` describing what you would like to buy in the email and subject.

It immediately replies with a button that leads you to Amazon with the very products you describe 🎩 🐇

## Using the LUIS MailBot Skill

Add natural language processing to any MailBot by just installing the LUIS MailBot skill, then setting up LUIS middleware.

```
npm install @mailbots/luis-ai
```

```javascript
const { luisMiddleware } = require("@mailbots/luis-ai");

mailbots.app.use(
  luisMiddleware({
    endpoint: "your_luis_endpoint_here"
  })
);

// Every handler is now NLP-enabled
mailbot.onCommand("hi", bot => {
  /// bot.skills.luis has NLP data!
});
```

## Setup

1. Go to [Luis.ai](https://www.luis.ai) and create an account.
1. Under \`Build > Intents > Add prebuilt domain intent\` add the **Shopping.FindItem** intent
1. Under \`Build > Entities > Add prebuilt entity \` add the **keyPhase** entity
1. Click "Train", then "Publish" in the top right (you must do this with each change)
1. Under \`Manage > Application Settings > Keys and Endpoints\`. Copy your Endpoint. It should look something like this:

_https://<region>.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<YOUR-KEY>&q=_
