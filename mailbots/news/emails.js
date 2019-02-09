exports.getProductHuntEmail = function(bot) {
  const email = {
    to: bot.get("source.from"),
    from: "Producthunt MailBots",
    subject: "Product Hunt Today",
    body: [
      {
        type: "html",
        html: `<div style="padding: 0px; margin: 0px; clear: both">
                              <br />
                              <h1><img src="http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/ph.png" height="30px" align="absmiddle" /> Product Hunt Today </h1>
                              </div>`
      }
    ]
  };

  const products = [
    {
      title: "Pexels 2.0",
      subhead: "The best free stock photos in one place",
      img: "http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/pexels.jpeg",
      votes: 6307,
      comments: 212
    },
    {
      title: "AutoDraw",
      subhead: "Autocorrect for drawing, by Google",
      img: "http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/autodraw.gif",
      votes: 7122,
      comments: 321
    },
    {
      title: "Slack",
      subhead: "Be less busy. Real-time messaging, archiving & search.",
      img: "http://fut-cdn.s3.amazonaws.com/gopher-demo-2017/slack.jpeg",
      votes: 6252,
      comments: 401
    }
  ];

  products.forEach(product => {
    email.body.push(
      {
        type: "html",
        html: `<table border="0" width="100%" style="float: left; margin-top: 10px">
                              <tr>
                                  <td valign="top" width="75px">
                                       <img width="75px" src="${product.img}">
                                  </td>
                                  <td valign="top">
                                      <p><strong>${product.title}</strong><br />
                                      ${product.subhead}<br />
                                      votes: <strong>${
                                        product.votes
                                      }</strong><br />
                                      comments: <strong>${
                                        product.comments
                                      }</strong>
                                  </p>
                                  </td>
                              </tr>
                              </table>
                              `
      },
      {
        type: "button",
        behavior: "action",
        text: "upvote",
        action: "upvote.332432",
        subject: "Hit send to upvote on Product Hunt",
        body: ``
      },
      {
        type: "button",
        behavior: "action",
        text: "comment",
        action: "comment.332432",
        subject: "Hit send to leave your comment on Product Hunt",
        body: ``
      },
      {
        type: "button",
        behavior: "url",
        text: "view",
        url: `https://www.producthunt.com`
      },
      {
        type: "button",
        behavior: "action",
        text: "save:tech",
        action: "save.tech",
        subject: "Hit 'send' to save this product to your tech list"
      },
      {
        type: "button",
        behavior: "action",
        text: "save:productivity",
        action: "save.productivity",
        subject: "Hit 'send' to save this product to your productivity list"
      },
      {
        type: "button",
        behavior: "action",
        text: "save:books",
        action: "save.books",
        subject: "Hit 'send' to save this product to your books list"
      },
      {
        type: "spacer"
      }
    );
  });

  // Add email footer
  email.body.push(
    {
      type: "label",
      text: "CHANGE SUBSCRIPTION"
    },
    {
      type: "button",
      behavior: "action",
      text: "daily",
      action: "assign.self",
      subject: "Hit send to assign this issue to yourself",
      body: ``
    },
    {
      type: "button",
      behavior: "action",
      text: "weekly",
      action: "assign.self",
      subject: "Hit send to assign this issue to yourself",
      body: ``
    },
    {
      type: "button",
      behavior: "action",
      text: "monthly",
      action: "assign.self",
      subject: "Hit send to assign this issue to yourself",
      body: ``
    },
    {
      type: "spacer"
    }
  );
  return email;
};
