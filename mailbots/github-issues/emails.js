exports.getGithubEmail = function(bot) {
  // pull some useful information out of the github webhook body
  const title = bot.get(
    'payload.body_json.issue.title',
    'Re: [mailbots/mailbots] Example ticket title'
  );
  const body = bot.get(
    'payload.body_json.issue.body',
    `The body of the issue would go here.`
  );
  const issueUrl = bot.get(
    'payload.body_json.issue.html_url',
    `https://github.com`
  );
  const repoName = bot.get('payload.body_json.repository.name');
  const creator = bot.get('payload.body_json.sender.login', `Reilly Sweetland`);
  const avatarUrl = bot.get(
    'payload.body_json.sender.avatar_url',
    `https://avatars3.githubusercontent.com/u/81267?s=460&v=4`
  );

  const gitHubEmail = {
    type: 'email',
    to: bot.get('source.from'),
    subject: `New issue for repo ${repoName}. Issue: ${title}; `,
    body: [
      {
        type: 'html',
        text: `<p>This email would be sent in place of the normal Github email notification, 
              allowing the recipient to take various actions on the ticket without leaving 
              their inbox.</p><hr />`
      },
      {
        type: 'section',
        text: 'GITHUB ISSUE'
      },
      {
        type: 'title',
        text: title
      },
      {
        type: 'html',
        text: `<img src="${avatarUrl}" width="25" height="25" valign="middle" /> ${creator}<br /><br />
        ${body}</img>`
      },
      {
        type: 'section',
        text: 'ADD LABELS'
      },
      {
        type: 'button',
        text: 'feature',
        action: 'label.feature',
        subject: "Hit send to add 'feature' label ",
        body: ``
      },
      {
        type: 'button',
        text: 'docs',
        action: 'label.wishlist',
        subject: "Hit send to add 'wishlist' label ",
        body: ``
      },
      {
        type: 'button',
        text: 'urgent',
        action: 'label.urgent',
        subject: "Hit send to add 'urgent' label ",
        body: ``
      },
      {
        type: 'button',
        text: 'bug',
        action: 'label.bug',
        subject: "Hit send to add 'bug' label ",
        body: ``
      },
      {
        type: 'section',
        text: 'ASSIGN'
      },
      {
        type: 'button',
        text: 'myself',
        action: 'assign.self',
        subject: 'Hit send to assign this issue to yourself',
        body: ``
      },
      {
        type: 'html',
        text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      },
      {
        type: 'section',
        text: 'ACTIONS'
      },
      {
        type: 'button',
        text: 'Comment',
        action: 'comment',
        subject: 'Hit send to add your comment',
        body: ``,
        style: 'block primary'
      },
      {
        type: 'button',
        text: 'Close Issue',
        action: 'github.close',
        subject: 'Close issue in Github',
        body: `Sending this email will close the issue "${title}" in GitHub.`,
        style: 'block'
      },
      {
        type: 'button',
        text: 'View On Github',
        url: issueUrl,
        style: 'block'
      },
      {
        type: 'section',
        text: 'FOLLOW UP'
      },
      {
        type: 'button',
        text: 'tomorrow',
        action: `remind.tomorrow`,
        subject: `Schedule a reminder for tomorrow`,
        body: ''
      },
      {
        type: 'button',
        text: '3days',
        action: `remind.3days`,
        subject: `Schedule a reminder for 3 days`,
        body: ''
      },
      {
        type: 'button',
        text: 'nextWeek',
        action: 'remind.nextWeek',
        subject: 'Schedule a reminder for next week',
        body: ''
      },
      {
        type: 'button',
        text: 'nextMonth',
        action: `remind.nextMonth`,
        subject: `Schedule a reminder for next month`,
        body: ''
      },
      {
        type: 'section'
      }
    ]
  };

  return gitHubEmail;
};
