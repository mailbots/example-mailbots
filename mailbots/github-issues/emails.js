exports.getGithubEmail = function(from, issueInfo) {
  const title = issueInfo.issue.title;
  const body = issueInfo.issue.body;
  const issueUrl = issueInfo.issue.html_url;
  const repoName = issueInfo.repository.name;
  const creator = issueInfo.sender.login;
  const avatarUrl = issueInfo.sender.avatar_url;

  const gitHubEmail = {
    type: "email",
    to: from,
    subject: `New issue for repo ${repoName}. Issue: ${title}`,
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
        html: `<img src="${avatarUrl}" width="25" height="25" valign="middle" /> ${creator}<br /><br />
        ${body}</img>`
      },
      {
        type: "label",
        text: "ADD LABELS"
      },
      {
        type: "button",
        behavior: "action",
        text: "feature",
        action: "label.feature",
        subject: "Hit send to add 'feature' label ",
        body: ``
      },
      {
        type: "button",
        behavior: "action",
        text: "docs",
        action: "label.wishlist",
        subject: "Hit send to add 'wishlist' label ",
        body: ``
      },
      {
        type: "button",
        behavior: "action",
        text: "urgent",
        action: "label.urgent",
        subject: "Hit send to add 'urgent' label ",
        body: ``
      },
      {
        type: "button",
        behavior: "action",
        text: "bug",
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
        behavior: "action",
        text: "myself",
        action: "assign.self",
        subject: "Hit send to assign this issue to yourself",
        body: ``
      },
      {
        type: "html",
        html: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      },
      {
        type: "label",
        text: "ACTIONS"
      },
      {
        type: "button",
        behavior: "action",
        text: "Comment",
        action: "comment",
        subject: "Hit send to add your comment",
        body: ``,
        style: "block primary"
      },
      {
        type: "button",
        behavior: "action",
        text: "Close Issue",
        action: "github.close",
        subject: "Close issue in Github",
        body: `Sending this email will close the issue "${title}" in GitHub.`,
        style: "block"
      },
      {
        type: "button",
        behavior: "url",
        text: "View On Github",
        url: issueUrl,
        style: "block"
      },
      {
        type: "label",
        text: "FOLLOW UP"
      },
      {
        type: "button",
        behavior: "action",
        text: "tomorrow",
        action: `remind.tomorrow`,
        subject: `Schedule a reminder for tomorrow`,
        body: ""
      },
      {
        type: "button",
        behavior: "action",
        text: "3days",
        action: `remind.3days`,
        subject: `Schedule a reminder for 3 days`,
        body: ""
      },
      {
        type: "button",
        behavior: "action",
        text: "nextWeek",
        action: "remind.nextWeek",
        subject: "Schedule a reminder for next week",
        body: ""
      },
      {
        type: "button",
        behavior: "action",
        text: "nextMonth",
        action: `remind.nextMonth`,
        subject: `Schedule a reminder for next month`,
        body: ""
      },
      {
        type: "label"
      }
    ]
  };

  return gitHubEmail;
};
