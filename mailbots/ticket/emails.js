exports.getGithubEmail = function(bot) {
  // pull some useful information out of the github webhook body
  const title = bot.get(
    "payload.body_json.issue.title",
    "Re: [mailbots/mailbots] Example ticket title"
  );
  const body = bot.get(
    "payload.body_json.issue.body",
    `The body of the issue would go here.`
  );
  const issueUrl = bot.get("payload.body_json.issue.url", `https://github.com`);
  const creator = bot.get("payload.body_json.sender.login", `Reilly Sweetland`);
  const avatarUrl = bot.get(
    "payload.body_json.sender.avatar_url",
    `https://avatars3.githubusercontent.com/u/81267?s=460&v=4`
  );

  // text styles we'll be in-lining...
  const textCSs = `font-family: \'Helvetica Neue\', Helvetica, Arial; font-size: 13px; line-height: 16px; color: #111111; margin: 0; padding: 0 5px 0 4px;`;

  const gitHubEmail = {
    type: "email",
    to: bot.get("source.from"),
    subject: `Issue Created: ${title}`,
    body: [
      {
        type: "html",
        html: `<p>This email would be sent in place of the normal Github email notification, 
              allowing the recipient to take various actions on the ticket without leaving 
              their inbox.</p><hr />`
      },
      {
        type: "label",
        text: "GITHUB ISSUE"
      },
      {
        type: "title",
        text: title
      },
      {
        type: "html",
        html: `<img src="${avatarUrl}" width="25" height="25" valign="middle" /> <span style="${textCSs} font-size: 14px;">${creator}</span>`
      },
      {
        type: "label",
        text: "ISSUE"
      },
      {
        type: "text",
        text: body
      },
      {
        type: "label",
        text: "ADD LABELS"
      },
      {
        type: "button",
        text: "feature",
        behavior: "action",
        action: "label.feature",
        subject: "Hit send to add 'feature' label ",
        body: ``
      },
      {
        type: "button",
        text: "docs",
        behavior: "action",
        action: "label.wishlist",
        subject: "Hit send to add 'wishlist' label ",
        body: ``
      },
      {
        type: "button",
        text: "urgent",
        behavior: "action",
        action: "label.urgent",
        subject: "Hit send to add 'urgent' label ",
        body: ``
      },
      {
        type: "button",
        text: "bug",
        behavior: "action",
        action: "label.bug",
        subject: "Hit send to add 'bug' label ",
        body: ``
      },
      {
        type: "label",
        text: "ASSIGN"
      },
      {
        type: "button",
        text: "andylibrian",
        behavior: "action",
        action: "assign.andylibrian",
        subject: "Hit send to assign this issue ",
        body: ``
      },
      {
        type: "button",
        text: "sallyjs34",
        behavior: "action",
        action: "assign.sallyjs34",
        subject: "Hit send to assign this issue ",
        body: ``
      },
      {
        type: "button",
        text: "rogerbaytonz",
        behavior: "action",
        action: "assign.rogerbaytonz",
        subject: "Hit send to assign this issue ",
        body: ``
      },
      {
        type: "button",
        text: "myself",
        behavior: "action",
        action: "assign.self",
        subject: "Hit send to assign this issue to yourself",
        body: ``
      },
      {
        type: "spacer"
      },
      {
        type: "label",
        text: "ACTIONS"
      },
      {
        type: "button",
        text: "Comment",
        behavior: "action",
        action: "comment",
        subject: "Hit send to add your comment",
        body: ``,
        style: "block primary"
      },
      {
        type: "button",
        text: "Close Issue",
        behavior: "action",
        action: "github.close",
        subject: "Close issue in Github",
        body: `This action email would complete the task in MailBots and close it in GitHub.`,
        style: "block"
      },
      {
        type: "button",
        text: "View On Github",
        behavior: "url",
        action: "url",
        url: issueUrl,
        style: "block"
      },
      {
        type: "button",
        text: "View on MailBots",
        behavior: "url",
        url: `${bot.config.mailbotsAdmin}/task/${bot.get("task.id")}`,
        style: "block"
      },
      {
        type: "label",
        text: "FOLLOW UP"
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
        action: "remind.nextWeek",
        subject: "Schedule a reminder for next week",
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

  return gitHubEmail;
};
