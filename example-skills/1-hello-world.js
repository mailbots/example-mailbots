// Exports your Gopher Skill as a function (A Node.js convention)
module.exports = function(gopherApp) {
  
  /**
   *  Send an email to "hello@your-subdomain.gopher.email"
   *  to trigger this function. This is an example of an
   *  Email Command. 
   */
  
  gopherApp.onCommand("hello", function(gopher) {

  /**
   * Your function is passed a "gopher" that comes pre-loaded
   * with skills and information to get stuff done. For example
   * let's send an email:
   */
    gopher.skills.webhook.addEmail({
      to: gopher.get("source.from"), // Send to the "from" address
      subject: "Hello World!"
    });

    /**
     * Gopher reports back, completing your skill handling.
     */
    gopher.respond();
  });
  
// End of exported function
}