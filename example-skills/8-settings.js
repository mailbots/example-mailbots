module.exports = function(mailbot) {
  /**
   * Render a settings form
   * See: https://github.com/mailbots/mailbots#onsettingsviewed
   */
  mailbot.onSettingsViewed(async function(bot) {
    const todoSettings = bot.webhook.settingsPage({
      namespace: "todo",
      title: "Todo Settings", // Page title
      menuTitle: "Todo" // Name of menu item
    });
    todoSettings.input({ name: "first_name", title: "First name" });
    todoSettings.submitButton();

    // Populate form values
    todoSettings.populate(bot.get("mailbot.saved_data.todo"));
    // Note bot.webhook.respond() is NOT called
  });

  /**
   * Handle when a settings form is saved. For example,
   * validate data or update data in another system.
   */
  mailbot.beforeSettingsSaved(bot => {
    // assuming the same "todo" namespace as shown in the above examples
    const data = bot.get("settings.todo");

    // this handler is fired any times settings are saved, even if its not our form
    if (!data) return;

    //
    // Perform API calls, update settings in exernal systems, etc.
    //
    const error = false;
    // if there was an error, abort the saving process
    if (error) {
      return bot.webhook.respond({
        webhook: {
          status: "error",
          message: "This is an error message"
        }
      });
    }

    // otherwise, implicitly returns success
  });
};
