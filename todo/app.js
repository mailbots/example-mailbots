require("dotenv").config();
const MailBotsClient = require("@mailbots/mailbots-sdk");
const MailBots = require("mailbots");
const mailbot = new MailBots();

/******************************************************************************************
 *                                      Email Commands
 *                      https://docs.mailbots.com/reference#email-commands
 * ****************************************************************************************/

/**
 * It's common to define an email centrally so it can be reused in multiple handlers.
 * For example, in response to commands, when a task is viewed and task reminders are due.
 * @param {object} bot Request helper: https://mailbots-app.mailbots.com/#webhookhelpers
 * @return {object} email
 */
function getTodoEmail(bot) {
  const textCSs = `font-family: \'Helvetica Neue\', Helvetica, Arial; font-size: 13px; line-height: 16px; color: #111111; margin: 0; padding: 0 5px 0 4px;`;
  const todoEmail = {
    to: bot.get("source.from"),
    from: "MailBots Todo",
    subject: bot.get("task.reference_email.subject"),
    body: [
      {
        type: "html",
        html: `<p style=${textCSs}>This is a complete todo example applicaiton. Add 
          notes, reminders, view and complete todo items right 
          from your inbox. View 'examples/todo-app.js' file to 
          see how it works and customize.</p><hr />`
      },
      {
        type: "html",
        html: `<h1>
                    Todo: ${bot.get("task.reference_email.subject")}
                </h1>`
      },
      {
        type: "button",
        text: "Complete",
        behavior: "action",
        action: "complete",
        style: "primary",
        subject: "Hit Send to Complete this task",
        body:
          "This is a MailBots email-action, a way to get stuff done without leaving your inbox."
      },
      {
        type: "button",
        text: "View Task",
        behavior: "url",
        url: `${bot.config.mailbotsAdmin}tasks/${bot.get("task.id")}`
      },
      {
        type: "html",
        html: `<table border=0" style="clear: both">
                <tr>
                    <td>
                        <h4>NOTES</h4>
                        <p>${bot.webhook.getTaskData(
                          "notes",
                          "Add notes to this todo below"
                        )}</p>
                    </td>
                </tr>
            </table>`
      },
      {
        type: "button",
        behavior: "action",
        text: "Add Notes",
        action: "add_notes",
        subject: "Add your notes to the email body"
      },
      {
        type: "spacer"
      },
      {
        type: "title",
        text: "Schedule Reminder"
      },
      {
        type: "button",
        text: "tomorrow",
        behavior: "action",
        action: `remind.tomorrow`,
        subject: `Schedule a reminder for tomorrow`,
        body: ""
      },
      {
        type: "button",
        text: "3days",
        behavior: "action",
        action: `remind.3days`,
        subject: `Schedule a reminder for 3 days`,
        body: ""
      },
      {
        type: "button",
        text: "nextWeek",
        behavior: "action",
        action: `remind.nextWeek`,
        subject: `Schedule a reminder for next week`,
        body: ""
      },
      {
        type: "button",
        text: "nextMonth",
        behavior: "action",
        action: `remind.nextMonth`,
        subject: `Schedule a reminder for next month`,
        body: ""
      },
      {
        type: "spacer"
      }
    ]
  };
  return todoEmail;
}

/**
 * Someone can either forward an email, cc or bcc
 * todo@your-app.mailbots.com to create a new todo
 * A task is created with every instance of a command.
 * By default, tasks are not marked as completed.
 */
mailbot.onCommand("todo", function(bot) {
  bot.webhook.sendEmail(getTodoEmail(bot));
  bot.webhook.respond();
});

/**
 * Handle our reminder becomes due.
 * This can be simulated in the Sandbox.
 *
 * NOTE: This is nearly identical to the above onCommand
 * handler. Find out about making reusable components here:
 * https://github.com/mailbots/mailbots#making-reusable-skills
 */
mailbot.onTrigger("todo", function(bot) {
  bot.webhook.sendEmail(getTodoEmail(bot));
  bot.webhook.respond();
});

/**
 * Render a preview when someone views a todo item
 * in the MailBots UI.
 *
 * NOTE: This is nearly identical to the above onCommand
 * handler. Find out about making reusable components here:
 * https://github.com/mailbots/mailbots#making-reusable-skills
 */
mailbot.onTaskViewed("todo", function(bot) {
  bot.webhook.sendEmail(getTodoEmail(bot));
  bot.webhook.respond();
});

/**
 * This email command retrieves a list of their pending todos. They could also view them
 * on the MailBots.com task UI, or you could send them their todos each morning using the mailbots.onTrigger() handler
 *
 * Note the use of MailBotsClient and how easy it is to authorize.
 * See https://mailbots-sdk-js.mailbots.com/ and http://mailbots.postman.co for more on the API.
 */
mailbot.onCommand("my-todos", async function(bot) {
  try {
    // Get pending todos
    const mbClient = MailBotsClient.fromBot(bot);
    const tasksRes = await mbClient.getTasks({ limit: 100 });
    const tasks = tasksRes.tasks || [];

    // Get our custom greeting (settings handler)
    const settings = bot.webhook.getMailBotData("todo", {});
    const greeting = settings.greeting;

    // Build and send HTML email
    let pendingTasksHtml = "";
    tasks.forEach(task => {
      const subject = task.reference_email.subject || "Blank Subject";
      //prettier-ignore
      pendingTasksHtml += `<p><a href="${bot.config.mailbotsAdmin}tasks/${task.id}" target="_blank">${subject}</a></p>`;
    });

    const email = bot.webhook.sendEmail({
      to: bot.get("source.from"),
      from: "MailBots Todo",
      subject: "Pending Todos",
      body: [
        {
          type: "title",
          text: `${greeting} Here are your pending todos`
        },
        {
          type: "html",
          text: pendingTasksHtml
        }
      ]
    });
  } catch (e) {
    console.log(e);
    debugger;
  }
  bot.webhook.respond();
});

/******************************************************************************************
 *                                      Action Emails
 *                      https://docs.mailbots.com/reference#action-emails
 *****************************************************************************************/

/**
 * Handle set reminder Action Email
 */
mailbot.onAction(/remind/, function(bot) {
  const actionParts = bot.action.split(".");
  const reminderTime = actionParts[1];
  bot.webhook.setTriggerTime(reminderTime);

  // Send confirmation email
  bot.webhook.sendEmail({
    to: bot.get("source.from"),
    subject: "Reminder Scheduled",
    body: [
      {
        type: "title",
        text: "Reminder Scheduled"
      }
    ]
  });
  bot.webhook.respond();
});

/**
 * Handle add notes Action Email
 */
mailbot.onAction("add_notes", function(bot) {
  // Save note data in MailBots.
  var existingNotes = bot.webhook.getTaskData("notes", "");
  var addNotes = bot.get("source.html") || bot.get("source.text");
  var newNote = existingNotes + addNotes;
  bot.webhook.setTaskData({ notes: newNote });

  // Send confirmation email
  bot.webhook.sendEmail({
    to: bot.get("source.from"),
    subject: "Notes Added",
    body: [
      {
        type: "title",
        text: "Note Added"
      },
      {
        type: "html",
        text: existingNotes
      }
    ]
  });
  bot.webhook.respond();
});

/**
 * "Complete" Action Email
 */
mailbot.onAction("complete", function(bot) {
  bot.webhook.completeTask();
  bot.webhook.sendEmail({
    to: bot.get("source.from"),
    subject: "Task Completed",
    body: [
      {
        type: "title",
        text: "Task Completed"
      }
    ]
  });
  bot.webhook.respond();
});

/******************************************************************************************
 *                                      Handle Settings
 *                      https://docs.mailbots.com/reference#mailbot-settings
 *****************************************************************************************/
/**
 * Render a settings form
 * See: https://github.com/mailbots/mailbots#onsettingsviewed and
 * https://mailbots-app.mailbots.com/#settingspagegetsettingsformjson
 *
 */
mailbot.onSettingsViewed(async function(bot) {
  const todoSettings = bot.webhook.settingsPage({
    namespace: "todo",
    title: "Todo Settings", // Page title
    menuTitle: "Todo" // Name of menu item
  });

  todoSettings.checkbox({
    name: "confirmation_emails",
    name: "Confirmation Emails"
  });

  todoSettings.input({
    name: "greeting",
    title: "Greeting",
    description: "How do you want your todo list go greet you?",
    placeholder: "Howdy!"
  });

  todoSettings.submitButton();

  todoSettings.populate(bot.webhook.getMailBotData("todo")); // Populate form values
  // Note bot.webhook.respond() is NOT called
});

/**
 * Handle when a settings form is saved.
 */
mailbot.beforeSettingsSaved(bot => {
  const data = bot.get("settings.todo");
  if (!data) return; // handler is fired when any settings are saved, even ones that are not relevant to this handler.

  // We could update 3rd party APIs, other systems or initiate OAuth workflows

  // if there was an error, we can abort the process and give a message
  // to the enduser like this:
  //   if (error) {
  //     return bot.webhook.respond({
  //       webhook: {
  //         status: "error",
  //         message: "This is an error message"
  //       }
  //     });
  //   }

  // otherwise, implicitly returns success
});

mailbot.listen();
