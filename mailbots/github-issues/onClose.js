const GitHub = require('github-api');

module.exports = async bot => {
  // fetch mailbot and task data
  const githubInfo = bot.get("mailbot.stored_data.github");
  const issueInfo = bot.get("task.stored_data.issueInfo");

  // get issue details
  const repoName = issueInfo.repository.name;
  const issueNo = issueInfo.issue.number;
  const username = issueInfo.sender.login;

  // call github API
  const github = new GitHub({
    token: githubInfo.token.access_token
  });
  const issues = github.getIssues(username, repoName);
  await issues.editIssue(issueNo, { state: "closed" });

  // close this task
  // bot.webhook.completeTask();

  // respond to webhook
  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `Issue #${issueNo} from ${repoName} was closed.`
  );
  bot.webhook.respond();
};
