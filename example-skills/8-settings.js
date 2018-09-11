module.exports = function(gopherApp) {
  /**
   * Render a settings form
   * See: https://github.com/gopherhq/gopher-app#onsettingsviewed
   */
  gopherApp.onSettingsViewed("todo", function(gopher, settings) {
    return {
      JSONSchema: {
        title: "Todo Settings",
        description: "Settings for my email-based todo list",
        type: "object",
        properties: {
          // Use an alert dialog to notify a user that action is needed.
          // For example, adding a required settings or authorizing a 3rd
          // party API. Note that both this and the below `alert` keys are needed.
          // alert: {
          //   type: "string"
          // },
          confirmationEmails: {
            type: "boolean",
            title: "Confirmation Emails"
          },
          startOfWeek: {
            type: "string",
            title: "Start Of Week",
            enum: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ]
          },
          firstName: {
            type: "string",
            title: "Todo List Name"
          }
        }
      },
      uiSchema: {
        // See above regarding the Alert
        // alert: {
        //   "ui:widget": "customAlertWidget",
        //   "ui:options": {
        //     title: "Connect Todo List to Github",
        //     text:
        //       "Authorize your accout with Github to begin the setup process",
        //     linkText: "Connect to Github",
        //     linkHref: "https://www.github.com", // Auth URI
        //     label: false
        //   }
        // },
        confirmationEmails: {
          "ui:help": "Send a confirmation emails with each new todo scheduled"
        }
      },
      formData: settings
    };
  });

  /**
   * Handle when a settings form is saved. For example,
   * validate data or update data in another system.
   */
  gopherApp.on("extension.settings_pre_save", function(gopher) {
    var settings = gopher.get("settings");

    var settingsAreValid = true;
    if (settingsAreValid) {
      gopher.webhook.respond();
    } else {
      // An error response prevents settings from being saved and shows
      // error message to user.
      return gopher.webhook.respond({
        webhook: {
          status: "error",
          message: "There was an error"
        }
      });
    }
  });
};
