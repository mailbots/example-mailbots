module.exports = function(gopherApp) {
  
  gopherApp.onCommand("crm", function(gopher) {

    const postponeTimes = ['1day', '2days','3days','5days','1weeks','2weeks','6weeks','3months','6months'];

    const email = {
      type: "email",
      to: gopher.get("source.from"),
      from: "Gopher",
      subject: "Salesforce Followup for Sally Mapleton",
      body: []
    };

    email.body.push({
      type: 'html',
      text: `<br /><img src="http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/sf.png" border="0" width="50px" style="float: right; padding: 10px;">
          <p>Followup reminder<br />
          <span style="font-size: 20px; line-height: 25px">Sally Mapleton</span><br />
          VP Engineering at Jones Corp</p>`
      });

      email.body.push({
        type: 'section',
        text: 'CONTACT INFORMATION'
      });

      email.body.push({
        type: 'button',
        text: 'email:smapleton@initech.com',
        url: 'mailto:smapleton@initech.com'
      });

      email.body.push({
        type: 'button',
        text: 'cell: 408-867-5309',
        url: 'tel:408-867-5309'
      });

      email.body.push({
        type: 'button',
        text: 'desk: 650-555-8857',
        url: 'tel:650-555-8857'
      });

      email.body.push({
        type: 'button',
        text: 'main: 650-555-1211',
        url: 'tel:650-555-1211'
      });

      email.body.push({
          type: 'html',
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        });

      email.body.push({
        type: 'section',
        text: 'SALESFORCE SHORTCUTS'
      });

      email.body.push({
        type: 'button',
        text: 'View Contact on Salesforce.com',
        url: 'salesforce.com'
      });

      email.body.push({
        type: 'button',
        text: 'Complete this activity',
        action: 'complete',
        subject: "Hit send to complete this activity",
      });

      email.body.push({
        type: 'button',
        text: 'Log a Call',
        action: 'log_a_call',
        subject: "Add notes below, then hit 'send'",
        body: ''
      });

      email.body.push({
        type: 'button',
        text: 'Add notes',
        action: 'add_notes',
        subject: "Add notes below, then hit 'send'",
        body: ''
      });

      email.body.push({
          type: 'html',
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        });

      email.body.push({
        type: 'section',
        text: 'LATEST SALESFORCE ACTIVITY',
        description: ''
      });

      email.body.push({
          type: 'html',
          text: `<p><em>Mon, Jan 23, 2018</em><br />
          <em>John Smith</em><br />
                  Sent followup email. </strong> Discount offered to move ahead before the end of the quarter.</p>`
        });

      email.body.push({
          type: 'html',
          text: `<p><em>Thurs, Jan 19, 2018</em><br /><em>John Smith</em><br >
                  Proposal sent. </strong> Quoted 3000 units. Special approval on pricing received from Tom in finance. Coordinate with Tom on future deals with this customer.</p>`
        });

      email.body.push({
          type: 'html',
          text: `<p><em>Thurs, Jan 19, 2018</em><br /><em>Sally Jones</em><br >
                  Special pricing approved.`
        });

      email.body.push({
          type: 'html',
          text: `<p><em>Monday, Jan 16, 2018</em><br /><em>John Smith</em><br >
                  Customer intersted in moving ahead. Needs 3000 units for use in upcoming event.</p>`
        });

      email.body.push({
          type: 'html',
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        });

      email.body.push({
        type: 'section',
        text: 'SCHEDULE FOLLOWUP'
      });

      // postponeTimes = _.get(gopher.user, 'postponeTimes', []);
        for (var i=0; i< postponeTimes.length; i++) {

          email.body.push({
            type: 'button',
            text: postponeTimes[i],
            action: `postpone.${postponeTimes[i]}`,
            subject: `Schedule a followup for ${postponeTimes[i]} (Add notes below)`,
            body: '',
          })
        }

      email.body.push({
          type: 'html',
          text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
        });
  
  gopher.respond();

  });

}