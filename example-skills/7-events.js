module.exports = function(gopherApp) {
  /**
   * How to create a Gopher task when a Github issue is opened.
   *
   * Copy / paste the github example webhook payload...
   * https://developer.github.com/v3/activity/events/types/#issuesevent
   * ...into the "Event" dropdown in the Sandbox.
   * Name the event "github.issue.opened"
   *
   * NOTE: For this to actually work, you would need to first set up Github to post to your
   * extension's event_url. This is mainly to demonstrate how the
   * event system works. Also, the Sandbox does not yet show email previews
   * of tasks created by the API (as shown below).
   */
  gopherApp.onEvent("github.issue.opened", async function(gopher) {
    // pull some useful information out of the github webhook body
    var title = gopher.get("payload.body_json.issue.title");
    var body = gopher.get("payload.body_json.issue.body");
    var issueUrl = gopher.get("payload.body_json.issue.url");
    var creator = gopher.get("payload.body_json.sender.login");
    var avatarUrl = gopher.get("payload.body_json.sender.avatar_url");

    // Send
    var githubTodoEmail = {
      to: gopher.get("user.primary_email"),
      from: "Gopher Todo",
      subject: `Todo Created From Github: ${title}`,
      body: [
        {
          type: "html",
          text: `<p>
                    Our to-do app created a new ToDo item when an issue
                    are was posted in Github.
                    <hr />
                  </p>`
        },
        {
          type: "html",
          text: `<h1>
                    Todo: ${title}
                </h1>
                <p>
                  ${body}
                </p>
                <p>
                  <hr />
                  Created by: <br />
                  <img src="${avatarUrl}" width="25" height="25" /><br />
                  ${creator}
                </p>`
        },
        {
          type: "button",
          text: "Close Issue",
          action: "github.close",
          style: "primary",
          subject: "Close issue in Github",
          body: `Once we integrate the Github API, this email-action can 
          complete the task in both Github and the Gopher Todo list`
        },
        {
          type: "button",
          text: "View Task On Gopher",
          url: `https://app.gopher.email/task/${gopher.get("task.id")}`
        },
        {
          type: "button",
          text: "View Task On Github",
          url: issueUrl
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
          action: "remind.nextWeek",
          subject: "Schedule a reminder for next week",
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
    };

    // GopherApp includes an authenticated instance of https://github.com/gopherhq/gopherhq-js
    // on the gopher.api object so it can be easily used with any request.
    // In the Sandbox, adjust your filter to view API calls to see this API call
    await gopher.api.createTask({
      task: {
        command: "github.todo@gopher-skills-kit.gopher.email",
        trigger_timeformat: "3days",
        send_messages: [githubTodoEmail]
      }
    });

    gopher.webhook.respond();
  });

  // Handle when a Github-type task triggers (ie, the reminder becomes due)
  gopherApp.onTrigger("github.todo", function(gopher) {
    // Pull the latest ticket info via github API. Send it in an email to the user.
    gopher.webhook.respond();
  });

  // Handle the email action to close the Github issue
  gopherApp.onAction("github.close", function(gopher) {
    // use Github API to close the issue
    gopher.webhook.quickReply("Issue closed via Github API");
    gopher.webhook.respond();
  });

  // Handle when a user views the future task
  gopherApp.onTaskViewed("github.todo", function(gopher) {
    // query Github API for latest ticket info...
    // render email
    gopher.set(
      "webhook.message",
      "This would show the github email with latest ticket information"
    );
    gopher.set("webhook.status", "warning"); // Forces warning message to render in Gopher Web App
    gopher.webhook.respond();
  });
};
