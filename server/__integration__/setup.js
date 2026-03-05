/**
 * Integration Test Setup
 *
 * This file sets up a real Pandapush server for integration testing.
 * These tests use:
 * - Real Express server
 * - Real Faye server with WebSocket support
 * - Real authentication extensions
 * - Real database (SQLite in-memory for tests)
 * - Real Redis connections
 */

const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("../routes");
const faye = require("../lib/faye");
const store = require("../lib/store");

// Mock logger to reduce noise in tests
jest.mock("../lib/logger", () => ({
  child: () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

let server;
let app;
let bayeux;
let internalClient;

/**
 * Creates and starts a test server
 */
async function setupTestServer() {
  // Create Express app
  app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Add req.log (needed by channel_controller.js errback handler)
  app.use((req, res, next) => {
    req.log = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };
    next();
  });

  // Create HTTP server from Express app (like production does)
  server = http.Server(app);

  // Set up Faye with real auth extension (pass HTTP server, like production)
  const fayeInstance = faye(server);
  bayeux = fayeInstance.bayeux;
  internalClient = fayeInstance.internalClient;

  // Initialize store with internal client (like production does)
  store.init(internalClient);

  // Add faye instance to all requests (like production does)
  app.use((req, res, next) => {
    req.faye = fayeInstance;
    next();
  });

  // Mount routes (including channel controller for publishing)
  const auth = {
    blocker: (req, res, next) => next(), // No admin auth needed for tests
    bouncer: (req, res, next) => next(),
    logout: (req, res) => res.send("logged out"),
    getUsername: (req, res, next) => {
      req.username = "test-user";
      next();
    }
  };
  routes.map(app, auth);

  // Start server on random port
  return new Promise(resolve => {
    server.listen(0, () => {
      const port = server.address().port;
      resolve({
        app,
        server,
        bayeux,
        internalClient,
        baseUrl: `http://localhost:${port}`,
        fayeUrl: `http://localhost:${port}/push`
      });
    });
  });
}

/**
 * Stops the test server and cleans up
 */
async function teardownTestServer() {
  return new Promise(resolve => {
    // Stop store polling and subscriptions
    store.stop();

    if (server) {
      server.close(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  setupTestServer,
  teardownTestServer
};
