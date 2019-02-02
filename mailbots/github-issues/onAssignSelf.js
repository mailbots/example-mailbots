const axios = require("axios");

module.exports = async bot => {
  const githubToken = bot.get("mailbot.stored_data.github.github_token");
  const issueInfo = bot.get("task.stored_data.issueInfo");

  const repoFullName = issueInfo.repository.full_name;
  const issueNo = issueInfo.issue.number;
  const login = issueInfo.issue.login;

  const { data: self } = await axios.get(
    `https://api.github.com/user?access_token=${githubToken}`
  );

  const url = `https://api.github.com/repos/${repoFullName}/issues/${issueNo}/assignees?access_token=${githubToken}`;

  await axios.post(url, { assignees: [self.login] });

  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `Issue #${issueNo} from ${repoFullName} was assigned to ${login}.`
  );
  bot.webhook.respond();
};
