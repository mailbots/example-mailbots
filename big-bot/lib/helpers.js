// Generic helper file. Hard to avoid...

exports.asyncThing = ms => new Promise(resolve => setTimeout(resolve, ms));

// Instantiate your LogDNA, Segment.io, Loggly, Splunk, Datadog, etc.
exports.logger = console; // ie, console.log
