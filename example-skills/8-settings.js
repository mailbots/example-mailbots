module.exports = function(gopherApp) {
  gopherApp.on("extension.settings_viewed", function(gopher) {
    // The user's existing settings
    const privateData = gopher.webhook.getExtensionData();

    // This example is taken from: https://mozilla-services.github.io/react-jsonschema-form/
    gopher.webhook.respond({
      settings: {
        JSONSchema: {
          title: "Settings Form",
          description: "A Settings Form.",
          type: "object",
          required: ["firstName", "lastName"],
          properties: {
            firstName: {
              type: "string",
              title: "First name"
            },
            lastName: {
              type: "string",
              title: "Last name"
            },
            age: {
              type: "integer",
              title: "Age"
            },
            bio: {
              type: "string",
              title: "Bio"
            },
            password: {
              type: "string",
              title: "Password",
              minLength: 3
            },
            telephone: {
              type: "string",
              title: "Telephone",
              minLength: 10
            }
          }
        },
        uiSchema: {
          firstName: {
            "ui:autofocus": true,
            "ui:emptyValue": ""
          },
          age: {
            "ui:widget": "updown",
            "ui:title": "Age of person",
            "ui:description": "(earthian year)"
          },
          bio: {
            "ui:widget": "textarea"
          },
          password: {
            "ui:widget": "password",
            "ui:help": "Hint: Make it strong!"
          },
          date: {
            "ui:widget": "alt-datetime"
          },
          telephone: {
            "ui:options": {
              inputType: "tel"
            }
          }
        },
        formData: privateData
      }
    });
  });

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
