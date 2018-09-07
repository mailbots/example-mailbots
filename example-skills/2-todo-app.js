module.exports = function(gopherApp) {
  /**
   * Someone can either forward an email, cc or bcc
   * todo@your-app.gopher.email to create a new todo
   */
  gopherApp.onCommand("todo", function(gopher) {
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      from: "Gopher Todo",
      subject: gopher.get("task.reference_email.subject"),
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
                    Todo: ${gopher.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a Gopher email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View Task",
          url: `https://app.gopher.email/task/${gopher.get("task.id")}`
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
                <tr>
                    <td>
                        <h4>NOTES</h4>
                        <p>${gopher.webhook.getTaskData(
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

    gopher.webhook.respond();
  });

  /**
   * Handle schedule reminder action
   */
  gopherApp.onAction(/remind/, function(gopher) {
    const actionParts = gopher.action.split(".");
    const reminderTime = actionParts[1];
    gopher.webhook.setTriggerTime(reminderTime);
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      subject: "Reminder Scheduled",
      body: [
        {
          type: "title",
          text: "Reminder Scheduled"
        }
      ]
    });
    gopher.webhook.respond();
  });

  /**
   * TODO: Date format helpers, action-token to create
   * email-based actions on each task.
   * The user emails view@my-todo-app.gopher.email
   * to view their outstanding reminders
   */
  gopherApp.onCommand("my-todos", async function(gopher) {
    try {
      const allTasks = await gopher.api.getTasks();
      let pendingTasksHtml = "";
      allTasks.tasks.forEach(task => {
        pendingTasksHtml += `
          <h3>${task.reference_email.subject}</h3>
          <p>${task.reference_email.to}</p>
          `;
      });
      const email = gopher.webhook.addEmail({
        to: gopher.get("source.from"),
        from: "Gopher Todo",
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
    gopher.webhook.respond();
  });

  /**
   * Handle add notes action
   */
  gopherApp.onAction("add_notes", function(gopher) {
    // Save note data in Gopher. You can also save
    // notes against the todo list API.
    var existingNotes = gopher.webhook.getTaskData("notes", "");
    var addNotes = gopher.get("source.html") || gopher.get("source.text");
    var newNote = existingNotes + addNotes;
    gopher.webhook.setTaskData({ notes: newNote });

    // Send confirmation email
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
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
    gopher.webhook.respond();
  });

  /**
   * Handle complete reminder action
   */
  gopherApp.onAction("complete", function(gopher) {
    // Complete task in Todoist.
    const reminderData = gopher.webhook.completeTask();
    console.log(reminderData);

    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      subject: "Task Completed",
      body: [
        {
          type: "title",
          text: "Task Completed"
        }
      ]
    });
    gopher.webhook.respond();
  });

  /**
   * Handle our reminder becomes due.
   * This can be simulated in the Sandbox.
   *
   * NOTE: This is nearly identical to the above onCommand
   * handler. Find out about making reusable components here:
   * https://github.com/gopherhq/gopher-app#making-reusable-skills
   */
  gopherApp.onTrigger("todo", function(gopher) {
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      subject: "Reminder: " + gopher.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<h1>
                    Todo: ${gopher.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a Gopher email-action, a way to get stuff done without leaving your inbox."
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
                        <p>${gopher.webhook.getTaskData(
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
    gopher.webhook.respond();
  });

  /**
   * Render a preview when someone views a todo item
   * in the Gopher UI.
   *
   * NOTE: This is nearly identical to the above onCommand
   * handler. Find out about making reusable components here:
   * https://github.com/gopherhq/gopher-app#making-reusable-skills
   */
  gopherApp.on("task.viewed", function(gopher) {
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      from: "Gopher Todo",
      subject: gopher.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>A user interacts with the below email preview and the actual
          email in the same way. Try the action buttons below.</p><hr />`
        },
        {
          type: "html",
          text: `<h1>
                    Todo: ${gopher.get("task.reference_email.subject")}
                </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a Gopher email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View Task",
          url: `https://app.gopher.email/task/${gopher.get("task.id")}`
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
                <tr>
                    <td>
                        <h4>NOTES</h4>
                        <p>${gopher.webhook.getTaskData(
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

    gopher.webhook.respond();
  });
};
