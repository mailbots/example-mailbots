# GitHub Issues

A mailbot used for managing your GitHub issues right from your inbox.
The CTO's next productivity buddy.

## Install

- [Create a MailBot](https://app.mailbots.com/developer/create) if you haven't done so already.
- `npm install`
- Populate `.env` with your bot's clientID, clientSecret and scope.
- Create a [GitHub oauth app](https://github.com/settings/developers)
- Fill GitHub app credentials in `.env` file
- `npm start`
- Install ngrok (ngrok.io) to set up a public URL
- run `ngrok http 3011` in a separate terminal window
- Go back to app.mailbots.com and update your MailBot's base url with the ngrok url
- Install on app.mailbots.com. You'll be taken to the sandbox where you can test your MailBot

## Docs

[MailBots Docs](https://docs.mailbots.com/) - Detailed platform documentation
[MailBots](https://www.npmjs.com/package/mailbots) – The core framework to build MailBots
[MailBots Node SDK](https://www.npmjs.com/package/@mailbots/mailbots-sdk) – Node.js and Browser API client
[MailBots REST API](https://mailbots.postman.co) - REST API Docs (Postman)
