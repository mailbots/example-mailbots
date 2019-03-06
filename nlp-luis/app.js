require("dotenv").config();
const _ = require("lodash");
const MailBots = require("mailbots");
const mailbot = new MailBots(); // config in .env
const {
  getBuyItemEmail,
  getFindItemEmail,
  getFailureEmail
} = require("./emails");
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

// Configure endpoint (not needed if only using middleware);
luisConfig({ endpoint: process.env.LUIS_ENDPOINT });

mailbot.onCommand("shop", async function(bot) {
  const keyPhrases = await getKeyPhrases(bot);
  if (!keyPhrases || !keyPhrases.length) {
    bot.webhook.sendEmail(getFailureEmail(bot));
    // prettier-ignore
    return bot.webhook.respond({ webhook: { status: "warn", message: "No Key Phrases. Did you enable them in Luis.ai under Build > Entities?" } });
  }
  const searchPhrases = keyPhrases.map(entity => entity.entity); // Pull search string only
  const searchUrl =
    "https://www.amazon.com/s/?field-keywords=" +
    encodeURIComponent(searchPhrases[0]);

  const topIntent = await getTopIntent(bot);
  if (topIntent === "Shopping.FindItem") {
    bot.webhook.sendEmail(getFindItemEmail({ bot, searchUrl, searchPhrases }));
  } else if (topIntent === "Shopping.BuyItem") {
    bot.webhook.sendEmail(getBuyItemEmail({ bot, searchUrl, searchPhrases }));
  } else {
    bot.webhook.sendEmail(getFailureEmail(bot));
    //prettier-ignore
    return bot.webhook.respond({ webhook: { status: "warn", message: "This demo MailBot only handles the Shopping.FindItem intent. Luis.ai found this: " + topIntent } });
  }

  bot.webhook.respond();
});

// Render Luis.ai settings page for developer setup (disable in prodution)
mailbot.onSettingsViewed(createLuisAiSettingsPage);

mailbot.listen();
