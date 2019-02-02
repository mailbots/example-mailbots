const axios = require('axios');

module.exports = label => {
  return async bot => {
    const githubToken = bot.get('mailbot.stored_data.github.github_token');
    const issueInfo = bot.get('task.stored_data.issueInfo');

    const repoFullName = issueInfo.repository.full_name;
    const issueNo = issueInfo.issue.number;

    const url = `https://api.github.com/repos/${repoFullName}/issues/${issueNo}/labels?access_token=${githubToken}`;

    await axios.post(url, { labels: [label] });

    bot.set('webhook.status', 'info');
    bot.set(
      'webhook.message',
      `Issue #${issueNo} from ${repoFullName} was labeled with "${label}".`
    );
    bot.webhook.respond();
  };
};
