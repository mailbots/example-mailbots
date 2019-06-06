const TurndownService = require("turndown");
const GitHub = require('github-api');

module.exports = async bot => {
  const repoName = bot.action.split(".")[1];

  // fetch mailbot and task data
  const githubInfo = bot.get("mailbot.stored_data.github");

  // convert the html email into markdown
  const commentHtml = bot.get("task.reference_email.html");
  const turndownService = new TurndownService();
  const commentMd = turndownService.turndown(commentHtml);

  // call github API
  const github = new GitHub({
    token: githubInfo.token.access_token
  });
  const me = github.getUser();
  const { data: profile } = await me.getProfile();
  const issues = github.getIssues(profile.login, repoName);
  await issues.createIssue({
    title: bot.get("task.reference_email.subject"),
    body: commentMd
  });

  // complete task
  bot.webhook.completeTask();

  // respond to webhook
  bot.set("webhook.status", "info");
  bot.set(
    "webhook.message",
    `New issue created to ${repoName}.`
  );
  bot.webhook.respond();
};
