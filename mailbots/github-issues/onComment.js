const TurndownService = require("turndown");
const axios = require("axios");

module.exports = async bot => {
  const githubToken = bot.get("mailbot.stored_data.github.github_token");
  const issueInfo = bot.get("task.stored_data.issueInfo");

  //the email html is the comment content
  let comment = bot.get("source.html");

  const turndownService = new TurndownService();

  // turn the comment into markdown
  comment = turndownService.turndown(comment);

  // api call to github

  const repoFullName = issueInfo.repository.full_name;
  const issueNo = issueInfo.issue.number;

  await axios.post(
    `https://api.github.com/repos/${repoFullName}/issues/${issueNo}/comments?access_token=${githubToken}`,
    { body: comment }
  );

  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `Comment for issue #${issueNo} from ${repoFullName} was sent.`
  );
  bot.webhook.respond();
};
