module.exports = function(gopherApp) {
  /**
   * Gopher Skills can be published as NPM modules. For example,
   * this skill automatically set reminders for a task using
   * spaced repetition - a memorization technique that sets
   * reminders at increatingly longer intervals each time.
   * Published skills can connect to APIs, set reminders,
   * export custom UI components and more.
   *
   * TODO: Add gopher-memorize to package.json after published.
   */
  // const memorizeSkill = require("gopher-memorize");
  // gopherApp.use(memorizeSkill);
  gopherApp.onCommand("remember", function(gopher) {
    // gopher.skills.memorize.start();
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      from: "Gopher Remember",
      subject: gopher.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>This email shows the use of an Gopher Skill 
          that was installed from npm called "gopher-memorize". This 
          skill sets the trigger schedule of any task at increasing 
          intervals, optimized for memorization.</p>
          <p>Trigger the task task via the sandbox to see this
          triggering in action. View source to see how it's done.</p>
          <hr />`
        },
        {
          type: "title",
          text: gopher.get("task.reference_email.subject")
        }
      ]
    });
    gopher.webhook.respond();
  });

  gopherApp.on("task.triggered", function(gopher) {
    // gopher.skills.memorize.memorizeTask();
    gopher.webhook.addEmail({
      to: gopher.get("source.from"),
      from: "Gopher Memorize",
      subject: gopher.get("task.reference_email.subject"),
      body: [
        {
          type: "html",
          text: `<p>Use the Sandbox to continue to trigger this
          task. Watch as the reminder intervals get further 
          and further apart with each trigger</p><hr />`
        },
        {
          type: "title",
          text: gopher.get("task.reference_email.subject")
        }
      ]
    });
    gopher.webhook.respond();
  });
};
