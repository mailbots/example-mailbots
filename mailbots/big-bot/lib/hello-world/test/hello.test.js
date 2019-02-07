// Test things in this module
const { expect } = require("chai");

// This...
const { asyncThing } = require("../../helpers.js");
// Is same as this...
// const asyncThing = require("../../helpers").asyncThing;

describe("unit tests general", function() {
  before(function(done) {
    console.log("runs once");
    done();
  });

  beforeEach(function(done) {
    console.log(process.env.ENV);

    console.log("runs before every test");
    done();
  });

  it("uses empty test as a todo");

  it("tests something", function(done) {
    expect(true).to.be.true;
    done(); // success
  });

  //   it.only("isolates only one test (very handy)", function(done) {
  //     expect(true).to.be.true;
  //     done(); // success
  //   });

  it.skip("fails a test", function(done) {
    expect(true).to.be.true;
    done("Anything here fails, or just throw an error");
  });

  it("tests an async function", async function() {
    // Simulate something async https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  });

  // Async functions always return a promise always. Even if they
  // just return a value, or implicitly return (no return called),
  // the promise still resolves. This lets you do stuff like this.
  it("tests something else async", async function() {
    expect(1).to.eq(1);
    // implicitly returns
  });
});
