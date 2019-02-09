const MailBotsClient = require("@mailbots/mailbots-sdk");

module.exports = function(mailbot) {
  /**
   * Someone can either forward an email, cc or bcc
   * todo@your-app.mailbots.com to create a new todo
   */
  mailbot.onCommand("todo", function(bot) {
    bot.webhook.sendEmail({
      to: bot.get("source.from"),
      from: "MailBots Todo",
      subject: bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>This is a complete todo example applicaiton. Add 
          notes, reminders, view and complete todo items right 
          from your inbox. View 'examples/todo-app.js' file to 
          see how it works and customize.</p><hr />`
        },
        {
          type: "html",
          text: `<h1>
                    Todo: ${bot.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a MailBots email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View Task",
          url: `${bot.mailbotsAdmin}tasks/${bot.get("task.id")}`
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
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
          text: "Add Notes",
          action: "add_notes",
          subject: "Add your notes to the email body"
        },
        {
          type: "section"
        },
        {
          type: "title",
          text: "Schedule Reminder"
        },
        {
          type: "button",
          text: "tomorrow",
          action: `remind.tomorrow`,
          subject: `Schedule a reminder for tomorrow`,
          body: ""
        },
        {
          type: "button",
          text: "3days",
          action: `remind.3days`,
          subject: `Schedule a reminder for 3 days`,
          body: ""
        },
        {
          type: "button",
          text: "nextWeek",
          action: `remind.nextWeek`,
          subject: `Schedule a reminder for next week`,
          body: ""
        },
        {
          type: "button",
          text: "nextMonth",
          action: `remind.nextMonth`,
          subject: `Schedule a reminder for next month`,
          body: ""
        },
        {
          type: "section"
        }
      ]
    });

    bot.webhook.respond();
  });

  /**
   * Handle schedule reminder action
   */
  mailbot.onAction(/remind/, function(bot) {
    const actionParts = bot.action.split(".");
    const reminderTime = actionParts[1];
    bot.webhook.setTriggerTime(reminderTime);
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
   * This email command retrieves a list of their pending todos. They could also view them
   * on the MailBots.com task UI, or you could send them their todos each morning.
   *
   * Note the use of MailBotsClient and how easy it is to authorize.
   * See https://mailbots-sdk-js.mailbots.com/ and http://mailbots.postman.co for more on the API.
   */
  mailbot.onCommand("my-todos", async function(bot) {
    try {
      mbClient = MailBotsClient.fromBot(bot);
      const allTasks = await mbClient.getTasks({ limit: 100 });
      allTasks.tasks = allTasks.tasks || [];
      const todoTasks = allTasks.tasks.filter(task =>
        task.command.includes("todo")
      );
      let pendingTasksHtml = "";
      todoTasks.forEach(task => {
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
            text: "Pending Todos"
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

  /**
   * Handle add notes action
   */
  mailbot.onAction("add_notes", function(bot) {
    // Save note data in MailBots. You can also save
    // notes against the todo list API.
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
   * Handle complete reminder action
   */
  mailbot.onAction("complete", function(bot) {
    // Complete task in Todoist.
    const reminderData = bot.webhook.completeTask();
    console.log(reminderData);

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

  /**
   * Handle our reminder becomes due.
   * This can be simulated in the Sandbox.
   *
   * NOTE: This is nearly identical to the above onCommand
   * handler. Find out about making reusable components here:
   * https://github.com/mailbots/mailbots#making-reusable-skills
   */
  mailbot.onTrigger("todo", function(bot) {
    bot.webhook.sendEmail({
      to: bot.get("source.from"),
      subject: "Reminder: " + bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<h1>
                    Todo: ${bot.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a MailBots email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View In Todoist",
          url: "https://todoist.com/"
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
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
          text: "Add Notes",
          action: "add_notes",
          subject: "Add your notes to the email body"
        },
        {
          type: "section"
        },
        {
          type: "title",
          text: "Schedule Reminder"
        },
        {
          type: "button",
          text: "tomorrow",
          action: `remind.tomorrow`,
          subject: `Schedule a reminder for tomorrow`,
          body: ""
        },
        {
          type: "button",
          text: "3days",
          action: `remind.3days`,
          subject: `Schedule a reminder for 3 days`,
          body: ""
        },
        {
          type: "button",
          text: "nextWeek",
          action: `remind.nextWeek`,
          subject: `Schedule a reminder for next week`,
          body: ""
        },
        {
          type: "button",
          text: "nextMonth",
          action: `remind.nextMonth`,
          subject: `Schedule a reminder for next month`,
          body: ""
        },
        {
          type: "section"
        }
      ]
    });
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
    bot.webhook.sendEmail({
      to: bot.get("source.from"),
      from: "MailBots Todo",
      subject: bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>A user interacts with the below email preview and the actual
          email in the same way. Try the action buttons below.</p><hr />`
        },
        {
          type: "html",
          text: `<h1>
                    Todo: ${bot.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a MailBots email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View Task",
          url: `${bot.config.mailbotsAdmin}/tasks/${bot.get("task.id")}`
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
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
          text: "Add Notes",
          action: "add_notes",
          subject: "Add your notes to the email body"
        },
        {
          type: "section"
        },
        {
          type: "title",
          text: "Schedule Reminder"
        },
        {
          type: "button",
          text: "tomorrow",
          action: `remind.tomorrow`,
          subject: `Schedule a reminder for tomorrow`,
          body: ""
        },
        {
          type: "button",
          text: "3days",
          action: `remind.3days`,
          subject: `Schedule a reminder for 3 days`,
          body: ""
        },
        {
          type: "button",
          text: "nextWeek",
          action: `remind.nextWeek`,
          subject: `Schedule a reminder for next week`,
          body: ""
        },
        {
          type: "button",
          text: "nextMonth",
          action: `remind.nextMonth`,
          subject: `Schedule a reminder for next month`,
          body: ""
        },
        {
          type: "section"
        }
      ]
    });

    bot.webhook.respond();
  });
};
