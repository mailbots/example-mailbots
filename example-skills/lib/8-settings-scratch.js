module.exports = function(gopheApp) {  mailbot.onSettingsViewed("memorize", function(settingsData) {
    return {
      JSONSchema: {
        title: "Memorization Settings",
        description: "Set up your memorizations.",
        type: "object",
        required: ["firstName", "lastName"],
        properties: {
          alert: {
            type: "string"
          },
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
        alert: {
          "ui:widget": "customAlertWidget",
          "ui:options": {
            title: "Enter Your Intercom API Key Below",
            text:
              "Add your Intercom API key below. Register for a new API key at developers.intercom.com",
            linkText: "Search on Google",
            linkHref: "https://www.google.com",
            label: false
          }
        },
        next_reminders: {
          "ui:widget": "customTextOnlyWidget"
        },
        firstName: {
          //   "ui:autofocus": true,
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
      formData: settingsData.mailbot.private_data.memorize
    };
  });

  mailbot.onSettingsViewed("github", function(settingsData) {
    return {
      JSONSchema: {
        title: "Github Settings",
        description: "Control how Github Interacts with MailBots.",
        type: "object",
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
          //   "ui:autofocus": true,
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
      formData: settingsData.mailbot.private_data.github
    };
  });

  //   mailbot.onSettingsViewed(function(settingsData) {
  //     console.log(settingsData);
  //   });

  mailbot.on("mailbot.settings_viewed", function(bot) {
    // The user's existing settings
    const privateData = bot.webhook.getMailBotData();

    // This example is taken from: https://mozilla-services.github.io/react-jsonschema-form/
    bot.webhook.respond({
      settings: {
        memorize: {
          JSONSchema: {
            title: "Memorization Settings",
            description: "Set up your memorizations.",
            type: "object",
            required: ["firstName", "lastName"],
            properties: {
              alert: {
                type: "string"
              },
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
            alert: {
              "ui:widget": "customAlertWidget",
              "ui:options": {
                title: "Connect Intercom",
                text:
                  "Add your Intercom API key below. Register for a new API key at developers.intercom.com",
                linkText: "Search on Google",
                linkHref: "https://www.google.com",
                label: false
              }
            },
            next_reminders: {
              "ui:widget": "customTextOnlyWidget"
            },
            firstName: {
              //   "ui:autofocus": true,
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
          formData: privateData.memorize
        },
        github: {
          JSONSchema: {
            title: "Github Settings",
            description: "Control how Github Interacts with MailBots.",
            type: "object",
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
              //   "ui:autofocus": true,
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
          formData: privateData.github
        }
      }
    });
    });