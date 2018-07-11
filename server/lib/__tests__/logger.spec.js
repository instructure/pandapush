/* eslint-env jest */

const logger = require("../logger");

it("creates a logger with a file stream", () => {
  const log = logger({ LOG_PATH: "/tmp" });
  expect(log).toBeDefined();
  expect(log.streams.length).toBe(1);
  expect(log.streams[0].type).toBe("rotating-file");
});

it("creates a stdout logger", () => {
  const log = logger({});
  expect(log).toBeDefined();
  expect(log.streams[0].stream).toBe(process.stdout);
});
