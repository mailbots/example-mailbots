module.exports = function(mailbot) {
  /**
   * How to create a MailBots task when a Github issue is opened.
   *
   * Copy / paste the github example webhook payload...
   * https://developer.github.com/v3/activity/events/types/#issuesevent
   * ...into the "Event" dropdown in the Sandbox.
   * Name the event "github.issue.opened"
   *
   * NOTE: For this to actually work, you would need to first set up Github to post to your
   * mailbot's event_url. This is mainly to demonstrate how the
   * event system works. Also, the Sandbox does not yet show email previews
   * of tasks created by the API (as shown below).
   */
  mailbot.onEvent("github.issue.opened", async function(bot) {
    // pull some useful information out of the github webhook body
    var title = bot.get("payload.body_json.issue.title");
    var body = bot.get("payload.body_json.issue.body");
    var issueUrl = bot.get("payload.body_json.issue.url");
    var creator = bot.get("payload.body_json.sender.login");
    var avatarUrl = bot.get("payload.body_json.sender.avatar_url");

    // Send
    var githubTodoEmail = {
      to: bot.get("user.primary_email"),
      from: "MailBots Todo",
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
          complete the task in both Github and the MailBots Todo list`
        },
        {
          type: "button",
          text: "View Task On MailBots",
          url: `https://app.mailbots.com/task/${bot.get("task.id")}`
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

    // MailBots includes an authenticated instance of https://github.com/mailbots/mailbots-sdk-js
    // on the bot.api object so it can be easily used with any request.
    // In the Sandbox, adjust your filter to view API calls to see this API call
    await bot.api.createTask({
      task: {
        command: "github.todo@mailbots-examples.eml.bot",
        trigger_timeformat: "3days",
        send_messages: [githubTodoEmail]
      }
    });

    bot.webhook.respond();
  });

  // Handle when a Github-type task triggers (ie, the reminder becomes due)
  mailbot.onTrigger("github.todo", function(bot) {
    // Pull the latest ticket info via github API. Send it in an email to the user.
    bot.webhook.respond();
  });

  // Handle the email action to close the Github issue
  mailbot.onAction("github.close", function(bot) {
    // use Github API to close the issue
    bot.webhook.quickReply("Issue closed via Github API");
    bot.webhook.respond();
  });

  // Handle when a user views the future task
  mailbot.onTaskViewed("github.todo", function(bot) {
    // query Github API for latest ticket info...
    // render email
    bot.set(
      "webhook.message",
      "This would show the github email with latest ticket information"
    );
    bot.set("webhook.status", "warning"); // Forces warning message to render in MailBots Web App
    bot.webhook.respond();
  });
};
