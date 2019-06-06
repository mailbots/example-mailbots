const TurndownService = require("turndown");
const GitHub = require('github-api');

module.exports = async bot => {
  // fetch mailbot and task data
  const githubInfo = bot.get("mailbot.stored_data.github");
  const issueInfo = bot.get("task.stored_data.issueInfo");

  // get issue details
  const repoName = issueInfo.repository.name;
  const issueNo = issueInfo.issue.number;
  const username = issueInfo.sender.login;

  // convert the html email into markdown
  const commentHtml = bot.get("source.html");
  const turndownService = new TurndownService();
  const commentMd = turndownService.turndown(commentHtml);

  // call github API
  const github = new GitHub({
    token: githubInfo.token.access_token
  });
  const issues = github.getIssues(username, repoName);
  await issues.createIssueComment(issueNo, commentMd);

  // respond to webhook
  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `Comment for issue #${issueNo} from ${repoName} was sent.`
  );
  bot.webhook.respond();
};
