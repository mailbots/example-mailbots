module.exports = async bot => {
  // mark task as not completed
  bot.set("task.completed", 0);

  // get repos that we are managing
  const botData = bot.webhook.getMailBotData();
  const installedRepos = botData.installed_repos || [];

  // create buttons for each repo
  const emailBody = installedRepos.map(r => {
    return {
      type: "button",
      text: r,
      behavior: "action",
      action: `addissueto.${r}`,
      subject: `Add this issue to ${r}`,
      body: bot.get("task.reference_email.text")
    };
  });

  bot.webhook.sendEmail({
    to: bot.get("source.from"),
    subject: bot.get("task.reference_email.subject"),
    body: [
      {
        type: "label",
        text: "Choose repository where the issue will be added"
      },
      ...emailBody,
      {
        type: "label"
      }
    ]
  });

  bot.webhook.respond();
};
