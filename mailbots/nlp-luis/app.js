require("dotenv").config();
const _ = require("lodash");
const MailBots = require("mailbots");
const mailbot = new MailBots(); // load from .env
const { getSuccessEmail, getFailureEmail } = require("./emails");
const {
  createLuisAiSettingsPage,
  getTopIntent,
  getIntents,
  getKeyPhrases
} = require("./luis");

// Render Luis.ai settings page
mailbot.onSettingsViewed(createLuisAiSettingsPage);

// When someone sends "shop@your-bot.eml.bot", we'll do this
mailbot.onCommand("shop", async function(bot) {
  const topIntent = await getTopIntent(bot);

  // If we wanted to inspect all possible intents and their probabilities
  //const allIntents = await getIntents(bot);

  // We're only handling FindItem right now. Add / train more intents on Luis.ai
  if (topIntent != "Shopping.FindItem") {
    bot.webhook.sendEmail(getFailureEmail(bot));
    return bot.webhook.respond({
      webhook: {
        status: "warn",
        message:
          "This demo MailBot only handles the Shopping.FindItem intent. Luis.ai found this: " +
          topIntent
      }
    });
  }

  // Note: Key Phrases are only present if you add them in Luis.ai under Build > Entities.
  const keyPhrases = await getKeyPhrases(bot);

  // No keyphrase? Fail and return
  if (!keyPhrases || !keyPhrases.length) {
    bot.webhook.sendEmail(getFailureEmail(bot));
    return bot.webhook.respond({
      webhook: {
        status: "warn",
        message:
          "No Key Phrases. Did you enable them in Luis.ai under Build > Entities?"
      }
    });
  }

  // Pull search string only
  const searchPhrases = keyPhrases.map(entity => entity.entity);

  // Assuming the user only searched for one thing...
  let searchUrl =
    "https://www.amazon.com/s/?field-keywords=" +
    encodeURIComponent(searchPhrases[0]);

  // Send the email with the magical shopping button.
  bot.webhook.sendEmail(getSuccessEmail({ bot, searchUrl, searchPhrases }));
  bot.webhook.respond();
});

// Start listening for requests
mailbot.listen();
