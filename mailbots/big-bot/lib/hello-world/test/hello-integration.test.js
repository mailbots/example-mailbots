// See: https://github.com/mailbots/mailbots#testing

const { expect } = require("chai");
const request = require("supertest");
const exportedApp = require("../../../app");

// Utility function to send webhook to our exported app
// For param passing technique, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
function sendWebhook({ exportedApp, webhookJson }) {
  return request(exportedApp)
    .post("/webhooks")
    .set("Accept", "application/json")
    .send(webhookJson);
}

describe("integration tests", function() {
  beforeEach(function() {
    // set up database, clients, etc.
  });

  it("responds to a webhook", async function() {
    // Create fixture by copying JSON object from sandbox
    // ⚠️ REMOVE token and ngrok url to avoid committing them
    // TODO: Grep for "ngrok" and "token". Warn on running test script.
    const webhookJson = require("./fixtures/hello-task-created.json");
    let { body } = await sendWebhook({ exportedApp, webhookJson });
    // Assert our webhook response looks like we want
    expect(body.send_messages[0].subject).to.equal("hi");
  });
});
