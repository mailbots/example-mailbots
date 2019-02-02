const axios = require("axios");

module.exports = async bot => {
  const githubToken = bot.get("mailbot.stored_data.github.github_token");
  const issueInfo = bot.get("task.stored_data.issueInfo");

  const repoFullName = issueInfo.repository.full_name;
  const issueNo = issueInfo.issue.number;

  const url = `https://api.github.com/repos/${repoFullName}/issues/${issueNo}?state=closed&access_token=${githubToken}`;

  await axios.patch(url, { state: "closed" });

  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `Issue #${issueNo} from ${repoFullName} was closed.`
  );
  bot.webhook.respond();
};
