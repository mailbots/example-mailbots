module.exports = function (gopherApp) {

  gopherApp.onCommand("ticket", function(gopher) {
  
  gopher.addEmail({
    type: "email",
    to: gopher.get("source.from"),
		subject: 'Re: [gopherhq/gopher-express] Parse recipient string',
		body: [
			{
				type: 'section',
				text: 'GITHUB ISSUE',
			},
			{
				type: 'title',
				text: 'Parse recipient string #112'
			},
			{
				type: 'html',
				text: `How about parsing the recipient string and sending in the webhook?`
			},
      {
        type: 'section',
        text: 'ADD LABELS',
      },
      {
         type: 'button',
         text: 'feature',
         action: 'label.feature',
         subject: "Hit send to add 'feature' label ",
         body: ``
      },
      {
         type: 'button',
         text: 'docs',
         action: 'label.wishlist',
         subject: "Hit send to add 'feature' label ",
         body: ``
      },
      {
         type: 'button',
         text: 'bug',
         action: 'label.bug',
         subject: "Hit send to add 'feature' label ",
         body: ``
      },
      {
        type: 'html',
        text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      },
      {
        type: 'section',
        text: 'ASSIGN',
      },
      {
         type: 'button',
         text: 'andylibrian',
         action: 'assign.andylibrian',
         subject: "Hit send to assign this issue to andylibrian ",
         body: ``
      },
      {
         type: 'button',
         text: 'myself',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
        type: 'html',
        text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      },
      {
        type: 'section',
        text: 'ACTIONS',
      },
      {
         type: 'button',
         text: 'Comment',
         action: 'comment',
         subject: "Hit send to add your comment",
         body: ``
      },
      {
         type: 'button',
         text: 'Close Ticket',
         action: 'close',
         subject: "Hit send to close this ticket",
         body: ``
      },
      {
        type: 'html',
        text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      },
      {
        type: 'section',
        text: 'FOLLOW UP',
      },
      {
         type: 'button',
         text: '1day',
         action: 'followup.1day',
         subject: "Hit send to schedule a followup for 1 day",
         body: ``
      },
      {
         type: 'button',
         text: '3days',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
         type: 'button',
         text: '1week',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
         type: 'button',
         text: '2weeks',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },		    
      {
         type: 'button',
         text: '3weeks',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
         type: 'button',
         text: '1month',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },	    
      {
         type: 'button',
         text: '2months',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
         type: 'button',
         text: '6months',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
         type: 'button',
         text: '1year',
         action: 'assign.self',
         subject: "Hit send to assign this issue to yourself",
         body: ``
      },
      {
        type: 'html',
        text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
      }
		]
	});
  
    gopher.respond();

  });
  
}