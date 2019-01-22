module.exports = function(mailbot) {
  mailbot.onCommand("example-crm", function(bot) {
    const postponeTimes = [
      "1day",
      "2days",
      "3days",
      "5days",
      "1weeks",
      "2weeks",
      "6weeks",
      "3months",
      "6months"
    ];

    const email = {
      type: "email",
      to: bot.get("source.from"),
      from: "MailBots",
      subject: "Salesforce Followup for Sally Mapleton",
      body: []
    };

    email.body.push({
      type: "html",
      text: `<p>This MailBots email pulls everything needed for the sales rep to follow up
        without having to leave their inbox. It would allow the rep to forward emails to their 
        CRM, and receive this reminder any time a reminder is due.</p><hr />`
    });

    email.body.push({
      type: "html",
      text: `<br /><img src="http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/sf.png" border="0" width="50px" style="float: right; padding: 10px;">
            <p>Followup reminder<br />
            <span style="font-size: 20px; line-height: 25px">Sally Mapleton</span><br />
            VP Engineering at Jones Corp</p>`
    });

    // Conditionally add data to email body
    const showContactData = true;
    if (showContactData) {
      email.body.push({
        type: "section",
        text: "CONTACT INFORMATION"
      });

      email.body.push({
        type: "button",
        text: "email:smapleton@initech.com",
        url: "mailto:smapleton@initech.com"
      });

      email.body.push({
        type: "button",
        text: "cell: 408-867-5309",
        url: "tel:408-867-5309"
      });

      email.body.push({
        type: "button",
        text: "desk: 650-555-8857",
        url: "tel:650-555-8857"
      });

      email.body.push({
        type: "button",
        text: "main: 650-555-1211",
        url: "tel:650-555-1211"
      });
    }

    email.body.push({
      type: "section"
    });

    email.body.push({
      type: "section",
      text: "SALESFORCE SHORTCUTS"
    });

    email.body.push({
      type: "button",
      text: "View Contact on Salesforce.com",
      url: "salesforce.com"
    });

    email.body.push({
      type: "button",
      text: "Complete this activity",
      action: "complete",
      subject: "Hit send to complete this activity"
    });

    email.body.push({
      type: "button",
      text: "Log a Call",
      action: "log_a_call",
      subject: "Add notes below, then hit 'send'",
      body: ""
    });

    email.body.push({
      type: "button",
      text: "Add notes",
      action: "add_notes",
      subject: "Add notes below, then hit 'send'",
      body: ""
    });

    email.body.push({
      type: "html",
      text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
    });

    email.body.push({
      type: "section",
      text: "LATEST SALESFORCE ACTIVITY",
      description: ""
    });

    email.body.push({
      type: "html",
      text: `<p><em>Mon, Jan 23, 2018</em><br />
            <em>John Smith</em><br />
                    Sent followup email. </strong> Discount offered to move ahead before the end of the quarter.</p>`
    });

    email.body.push({
      type: "html",
      text: `<p><em>Thurs, Jan 19, 2018</em><br /><em>John Smith</em><br >
                    Proposal sent. </strong> Quoted 3000 units. Special approval on pricing received from Tom in finance. Coordinate with Tom on future deals with this customer.</p>`
    });

    email.body.push({
      type: "html",
      text: `<p><em>Thurs, Jan 19, 2018</em><br /><em>Sally Jones</em><br >
                    Special pricing approved.`
    });

    email.body.push({
      type: "html",
      text: `<p><em>Monday, Jan 16, 2018</em><br /><em>John Smith</em><br >
                    Customer intersted in moving ahead. Needs 3000 units for use in upcoming event.</p>`
    });

    email.body.push({
      type: "html",
      text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
    });

    email.body.push({
      type: "section",
      text: "SCHEDULE FOLLOWUP"
    });

    // postponeTimes = _.get(bot.user, 'postponeTimes', []);
    for (var i = 0; i < postponeTimes.length; i++) {
      email.body.push({
        type: "button",
        text: postponeTimes[i],
        action: `postpone.${postponeTimes[i]}`,
        subject: `Schedule a followup for ${
          postponeTimes[i]
        } (Add notes below)`,
        body: ""
      });
    }

    email.body.push({
      type: "html",
      text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
    });
    bot.webhook.addEmail(email);
    bot.webhook.respond();
  });

  /**
   * A Github ticket
   */
  mailbot.onCommand("example-ticket", function(bot) {
    bot.webhook.addEmail({
      to: bot.get("source.from"),
      subject: "Re: [mailbots/mailbots] Example ticket title",
      body: [
        {
          type: "html",
          text: `<p>This email would be sent in place of the normal Github email notification, 
            allowing the recipient to take various actions on the ticket without leaving 
            their inbox.</p><hr />`
        },
        {
          type: "section",
          text: "GITHUB ISSUE"
        },
        {
          type: "title",
          text: "Parse recipient string #112"
        },
        {
          type: "html",
          text: `The github ticket text would go here. Normally this email would be sent
                   when a new ticket has been created.`
        },
        {
          type: "section",
          text: "ADD LABELS"
        },
        {
          type: "button",
          text: "feature",
          action: "label.feature",
          subject: "Hit send to add 'feature' label ",
          body: ``
        },
        {
          type: "button",
          text: "docs",
          action: "label.wishlist",
          subject: "Hit send to add 'feature' label ",
          body: ``
        },
        {
          type: "button",
          text: "bug",
          action: "label.bug",
          subject: "Hit send to add 'feature' label ",
          body: ``
        },
        {
          type: "html",
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        },
        {
          type: "section",
          text: "ASSIGN"
        },
        {
          type: "button",
          text: "andylibrian",
          action: "assign.andylibrian",
          subject: "Hit send to assign this issue to andylibrian ",
          body: ``
        },
        {
          type: "button",
          text: "myself",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "html",
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        },
        {
          type: "section",
          text: "ACTIONS"
        },
        {
          type: "button",
          text: "Comment",
          action: "comment",
          subject: "Hit send to add your comment",
          body: ``
        },
        {
          type: "button",
          text: "Close Ticket",
          action: "close",
          subject: "Hit send to close this ticket",
          body: ``
        },
        {
          type: "html",
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        },
        {
          type: "section",
          text: "FOLLOW UP"
        },
        {
          type: "button",
          text: "1day",
          action: "followup.1day",
          subject: "Hit send to schedule a followup for 1 day",
          body: ``
        },
        {
          type: "button",
          text: "3days",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "1week",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "2weeks",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "3weeks",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "1month",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "2months",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "6months",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "button",
          text: "1year",
          action: "assign.self",
          subject: "Hit send to assign this issue to yourself",
          body: ``
        },
        {
          type: "html",
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        }
      ]
    });
    bot.webhook.respond();
  });

  /**
   * Integrate your todo list with Todoist
   */
  mailbot.onCommand("example-wunderlist", function(bot) {
    // This would operate similarly to the base todo app, but it would keep data in sync with Todoist.
    bot.webhook.addEmail({
      to: bot.get("source.from"),
      from: "MailBots Todoist",
      subject: bot.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>This would be sent any time a Wunderlist reminder triggers, allowing the user to take 
            action right from their email</p><hr />`
        },
        {
          type: "html",
          text: `<h1>
                      <img src="https://dr0wv9n0kx6h5.cloudfront.net/664cb69d34d0ef040ff8a446e429bce8feb54b41/site/images/logo-big.png" width="30px" align="absmiddle">
                      ${bot.get("task.reference_email.subject")}
                  </h1>`
        },
        {
          type: "button",
          text: "Complete",
          action: "complete",
          style: "primary",
          subject: "Hit Send to Complete this task",
          body:
            "This is a MailBots email-action, a way to get stuff done without leaving your inbox."
        },
        {
          type: "button",
          text: "View In Wunderlist",
          url: "https://wunderlist.com/"
        },
        {
          type: "html",
          text: `<table border=0" style="clear: both">
                  <tr>
                      <td>
                          <h4>NOTES</h4>
                          <p>${bot.webhook.getTaskData(
                            "notes",
                            "Add notes to this todo below"
                          )}</p>
                      </td>
                  </tr>
              </table>`
        },
        {
          type: "button",
          text: "Add Notes In Wunderlist",
          action: "add_notes",
          subject: "Add your notes to the email body"
        },
        {
          type: "section"
        },
        {
          type: "section"
        }
      ]
    });
    bot.webhook.respond();
  });
};
