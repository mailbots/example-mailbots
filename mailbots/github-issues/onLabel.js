const axios = require("axios");
const GitHub = require('github-api');
module.exports = label => {
  return async bot => {
    const githubInfo = bot.get("mailbot.stored_data.github");
    const issueInfo = bot.get("task.stored_data.issueInfo");

    const github = new GitHub({
      token: githubInfo.token.access_token
    });
    const repoName = issueInfo.repository.name;
    const issueNo = issueInfo.issue.number;
    const username = issueInfo.sender.login;

    // const url = `https://api.github.com/repos/${repoFullName}/issues/${issueNo}/labels?access_token=${githubToken}`;
    // await axios.post(url, { labels: [label] });

    const issues = github.getIssues(username, repoName);
    await issues.editIssue(issueNo, { labels: [label] });

    bot.set("webhook.status", "info");
    bot.set(
      "webhook.message",
      `Issue #${issueNo} from ${repoName} was labeled with "${label}".`
    );
    bot.webhook.respond();
  };
};
