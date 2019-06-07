const notAuthorizedText =
  `# GitHub Issues MailBot
Manage your GitHub issues without leaving your inbox.
Quickly assign labels, take ownership or comment on newly created issues from your email client.
All of this works via GitHub's OAuth apps by creating webhooks in your repositories that notify this mailbot.
In order to get started we need you to authorize your account with GitHub.
`;

const reposPickDescriptionText =
  `### Configure repositories
Choose the repositories that you want to use with this mailbot.
This will create webhooks in each selected repo.
Don't worry, if you uninstall the bot, we will also remove any created hooks.
`;

module.exports = {
  notAuthorizedText,
  reposPickDescriptionText
};
