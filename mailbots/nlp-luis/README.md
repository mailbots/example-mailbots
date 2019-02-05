Mailbots is a platform to create bots, AIs and assistants that get things done right from your inbox. Read more at [https://www.mailbots.com](mailbots.com).

## Luis.ai NLP Example

This demo uses Luis.ai to parse and extract meaning from email. A simple example is provided, but Luis.ai
has built-in knowledge of numerous domains can extract many different types of entities. With some simple modifications
you'll be extracting places, dates, times and locations in no time. [Read the Luis.ai docs](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/) for more.

## Using This MailBot

Send an email to `shop@your-bot-address.eml.bot` describing what you would like to buy in the email and subject.

It immediately replies with a button that leads you to Amazon with the very products you describe 🎩 🐇

## Setup

1. Go to [Luis.ai](https://www.luis.ai) and create an account.
1. Under \`Build > Intents > Add prebuilt domain intent\` add the **Shopping.FindItem** intent
1. Under \`Build > Entities > Add prebuilt entity \` add the **keyPhase** entity
1. Click "Train", then "Publish" in the top right (you must do this with each change)
1. Under \`Manage > Application Settings > Keys and Endpoints\`. Copy your Endpoint. It should look something like this:

_https://<region>.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<YOUR-KEY>&q=_
