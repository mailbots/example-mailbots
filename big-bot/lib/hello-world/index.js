/**
 * This is the module's "API" to expose resources to other modules.
 * Hide logic and behavior within lib. This is also handy if you
 * want to package up your module as it's on npm module.
 *
 * Other modules can use it like this: const { getGreeting } = require("../hello-world");
 */
const { getNames } = require("./lib/names");

/**
 * Comments are especially important in the the resources
 * shared from the top-level module index.js file
 * @returns {String} - A greeting
 */
exports.getGreeting = function() {
  return `Hello ${getNames()[0]}!`;
};
