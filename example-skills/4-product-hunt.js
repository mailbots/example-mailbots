const _ = require('lodash');

module.exports = function (gopherApp) {
  gopherApp.onCommand("producthunt", function (gopher) {
 
  // Gopher only sends the email when gopher.respnd() is called.
  // until then, the email can be further modified.
  const email = gopher.webhook.addEmail({
    to: gopher.get("source.from"),
    from: "Producthunt Gopher",
		subject: 'Product Hunt Today',
    		body: [
		    {
		    	type: 'html',
		    	text: `<div style="padding: 0px; margin: 0px; clear: both">
		    			<br />
		    			<h1><img src="http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/ph.png" height="30px" align="absmiddle" /> Product Hunt Today </h1>
		    			</div>`
		    }
		]
	});

  const products = [
	{
		title: 'Pexels 2.0',
		subhead: 'The best free stock photos in one place',
		img: 'http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/pexels.jpeg',
		votes: 6307,
		comments: 212
	},
	{
		title: 'AutoDraw',
		subhead: 'Autocorrect for drawing, by Google',
		img: 'http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/autodraw.gif',
		votes: 7122,
		comments: 321
	},
	{
		title: 'Slack',
		subhead: 'Be less busy. Real-time messaging, archiving & search.',
		img: 'http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/slack.jpeg',
		votes: 6252,
		comments: 401
	}
]
  
	products.forEach((product) => {

		email.body.push(
			{
		    	type: 'html',
		    	text: `<table border="0" width="100%" style="float: left; margin-top: 10px">
		    			<tr>
				    		<td valign="top" width="75px">
				    			 <img width="75px" src="${product.img}">
				    		</td>
		    				<td valign="top">
				    			<p><strong>${product.title}</strong><br />
				    			${product.subhead}<br />
				    			votes: <strong>${product.votes}</strong><br />
				    			comments: <strong>${product.comments}</strong>
				    		</p>
				    		</td>
				    	</tr>
				    	</table>
		    			`
		    },
		    {
			     type: 'button',
			     text: 'upvote',
			     action: 'upvote.332432',
			     subject: "Hit send to upvote on Product Hunt",
			     body: ``
		    },
		    {
			     type: 'button',
			     text: 'comment',
			     action: 'comment.332432',
			     subject: "Hit send to leave your comment on Product Hunt",
			     body: ``
		    }, 
		    {
			     type: 'button',
			     text: 'view',
			     url: `https://www.producthunt.com`
		    },
		    {
			     type: 'button',
			     text: 'save:tech',
           action: 'save.tech',
          subject: "Hit 'send' to save this product to your tech list"
		    },
		    {
			     type: 'button',
			     text: 'save:productivity',
			     url: `https://www.producthunt.com`
		    }, 
		    {
			     type: 'button',
			     text: 'save:books',
			     url: `https://www.producthunt.com`
		    },
		    {
		    	type: 'section',
		    })
	});
  
	email.body.push(
			{
				type: 'section',
				title: 'CHANGE SUBSCRIPTION'
			},
		    {
			     type: 'button',
			     text: 'daily',
			     action: 'assign.self',
			     subject: "Hit send to assign this issue to yourself",
			     body: ``
		    },
		    {
			     type: 'button',
			     text: 'weekly',
			     action: 'assign.self',
			     subject: "Hit send to assign this issue to yourself",
			     body: ``
		    },
		    {
			     type: 'button',
			     text: 'monthly',
			     action: 'assign.self',
			     subject: "Hit send to assign this issue to yourself",
			     body: ``
		    },
		    {
		    	type: 'html',
		    	text: '<div style="padding: 0px; margin: 0px; clear: both"></div>'
		    });

    gopher.respond();

});
}