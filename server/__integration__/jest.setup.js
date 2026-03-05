/**
 * Jest Setup for Integration Tests
 * Runs before all integration tests
 */

// Polyfill TextEncoder/TextDecoder for Node < 11
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder, TextDecoder } = require("util");
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
