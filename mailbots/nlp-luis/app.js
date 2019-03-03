require("dotenv").config();
const _ = require("lodash");
const MailBots = require("mailbots");
const mailbot = new MailBots(); // load from .env
const { getSuccessEmail, getFailureEmail } = require("./emails");
const {
  createLuisAiSettingsPage,
  getTopIntent,
  getKeyPhrases,
  luisMiddleware,
  luisConfig
} = require("@mailbots/luis-ai");

// OPTIONAL: Instead of explicitly calling LUIS functions as shown below,
// the middlware runs every request through LUIS with bot.skills.luis
mailbot.app.use(luisMiddleware({ endpoint: process.env.LUIS_ENDPOINT }));

// Configure endpoint (not needed if you're only using middleware);
luisConfig({ endpoint: process.env.LUIS_ENDPOINT });

// When someone sends "shop@your-bot.eml.bot"
mailbot.onCommand("shop", async function(bot) {
  // console.log(bot.skills.luis); // FUll LUIS output is also available here thanks to middlware
  const topIntent = await getTopIntent(bot);

  // Inspect all possible intents and their probabilities
  //const allIntents = await getIntents(bot);

  // We're only handling FindItem right now. Add / train more intents on Luis.ai
  if (topIntent != "Shopping.FindItem") {
    bot.webhook.sendEmail(getFailureEmail(bot));
    //prettier-ignore
    return bot.webhook.respond({ webhook: { status: "warn", message: "This demo MailBot only handles the Shopping.FindItem intent. Luis.ai found this: " + topIntent } });
  }

  // Extract Key Phrases (only present if you add them in Luis.ai under Build > Entities)
  const keyPhrases = await getKeyPhrases(bot);

  // No keyphrase? Fail and return
  if (!keyPhrases || !keyPhrases.length) {
    bot.webhook.sendEmail(getFailureEmail(bot));
    // prettier-ignore
    return bot.webhook.respond({ webhook: { status: "warn", message: "No Key Phrases. Did you enable them in Luis.ai under Build > Entities?" } });
  }

  // Pull search string only
  const searchPhrases = keyPhrases.map(entity => entity.entity);

  // Build search query
  let searchUrl =
    "https://www.amazon.com/s/?field-keywords=" +
    encodeURIComponent(searchPhrases[0]);

  // Send email with magical shopping button.
  bot.webhook.sendEmail(getSuccessEmail({ bot, searchUrl, searchPhrases }));
  bot.webhook.respond();
});

// DEMO ONLY: Render Luis.ai settings page for developer setup
mailbot.onSettingsViewed(createLuisAiSettingsPage);

// Start listening for requests
mailbot.listen();
