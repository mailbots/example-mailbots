// Exports your Gopher Skill (A Node.js convention)
module.exports = function(gopherApp) {
  /**
   *  Send an email to "hello@your-subdomain.gopher.email"
   *  to trigger this function. This is an example of an
   *  Email Command.
   */

  gopherApp.onCommand("hello-world", function(gopher) {
    /**
     * Your function is passed a "gopher" that comes pre-loaded
     * with skills and information to get stuff done. For example
     * let's send an email:
     */
    gopher.webhook.addEmail({
      to: gopher.get("source.from"), // Send to the "from" address
      subject: "Hello World!",
      body: [
        {
          type: "html",
          text: `<p>Gopher received your email and sent a webhook to your 
          extension. Your extension then responded with JSON that told Gopher
          to send this email.</p>

          <img src="https://files.readme.io/2bfee74-gopher-req-res.png" width="100%" border="0"/>
          
          <p>View the source code for your extension and read the comments. You can also 
          view our <a href="https://docs.gopher.email/v1.0/reference#email-ui-component-reference">documentation</a>. 
          </p>`
        }
      ]
    });

    /**
     * Gopher reports back, completing your skill handling.
     */
    gopher.webhook.respond();
  });

  // End of exported function
};
