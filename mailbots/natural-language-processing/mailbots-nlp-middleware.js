const rp = require('request-promise')
const striptags = require('striptags')

async function getIntent(req, res, next) {
  const bot = res.locals.bot;  
  const emailBody = striptags(bot.webhook.get("source.text"));
  const emailSubject = striptags(bot.webhook.get("source.subject"));
  // Endpoint configured on Skill settings page.
  const luisEndpoint = bot.get('mailbot.stored_data.natural_language_middleware.luis_endpoint');
     
  try {
    const nlpResponse = await rp({
      uri: luisEndpoint + emailBody,
      json: true
    })
    bot.bodyIntent = nlpResponse
  } catch (e) {
    console.log('API call failed', e);
    bot.bodyIntent = null
  }
  
  try {
    const nlpResponse = await rp({
      uri: luisEndpoint + emailSubject,
      json: true
    })
    bot.subjectIntent = nlpResponse
  } catch (e) {
    console.log('API call failed', e);
    bot.subjectIntent = null
  }
  
  next();
}

function handleNLPSettings(mailbot) {
  // Create settings page
  mailbot.onSettingsViewed(function(bot) {
    const nlpSettings = bot.webhook.settingsPage({
      namespace: "natural_language_middleware",
      title: "LUIS Settings", // Page title
      menuTitle: "LUIS settings" // Name of menu item
    });
    nlpSettings.text(`After you have set up your LUIS app the url you need is located at **Application Settings > Keys and Endpoints > Endpoint**. It should look something like this:

*https://<region>.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<YOUR-KEY>&q=*`);

    nlpSettings.input({name: "luis_endpoint", title: "Endpoint URL"});
    nlpSettings.submitButton();

    // Populate form values
    nlpSettings.populate(bot.get("mailbot.stored_data.natural_language_middleware"));
  });
}

function use(mailbot) {
  mailbot.app.use(getIntent);
  handleNLPSettings(mailbot);
}

module.exports = use;