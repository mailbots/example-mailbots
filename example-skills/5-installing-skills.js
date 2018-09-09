module.exports = function(gopherApp) {
  /**
   * Gopher Skills can be published as NPM modules. For example,
   * this skill automatically set reminders for a task using
   * spaced repetition - a memorization technique that sets
   * reminders at increatingly longer intervals each time.
   * Skills can connect to APIs, set reminders, export custom
   * UI elements and handle their own settings.
   */
  var memorize = require("gopher-memorize")(gopherApp);

  gopherApp.onCommand("remember", function(gopher) {
    memorize.memorizeTask(gopher);
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
        ...memorize.renderMemorizationControls(gopher),
        {
          type: "section"
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
    memorize.memorizeTask(gopher);
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
        },
        ...memorize.renderMemorizationControls(gopher)
      ]
    });
    gopher.webhook.respond();
  });
};
