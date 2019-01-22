module.exports = function(mailbot) {
  /**
   * Someone can either forward an email, cc or bcc
   * todo@your-app.mailbots.com to create a new todo
   */
  mailbot.onCommand("todo", function(bot) {
    bot.webhook.addEmail({
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
          url: `https://app.mailbots.com/task/${bot.get("task.id")}`
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
    bot.webhook.addEmail({
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
   * The user emails view@my-todo-app.mailbots.com
   * to view their outstanding reminders
   */
  mailbot.onCommand("my-todos", async function(bot) {
    try {
      const allTasks = await bot.api.getTasks();
      let pendingTasksHtml = "";
      allTasks.tasks.forEach(task => {
        pendingTasksHtml += `
          <h3>${task.reference_email.subject}</h3>
          <p>${task.reference_email.to}</p>
          `;
      });
      const email = bot.webhook.addEmail({
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
    bot.webhook.addEmail({
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

    bot.webhook.addEmail({
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
    bot.webhook.addEmail({
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
    bot.webhook.addEmail({
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
          url: `https://app.mailbots.com/task/${bot.get("task.id")}`
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
