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
let fayeAdapter;
let allRedisClients = [];

/**
 * Creates and starts a test server
 */
async function setupTestServer() {
  // Create Express app
  // Monkey-patch Redis createClient to track all clients
  const redis = require("redis");
  const originalCreateClient = redis.createClient;
  redis.createClient = function(...args) {
    const client = originalCreateClient.apply(this, args);
    allRedisClients.push(client);
    return client;
  };
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

  // Monkey-patch Faye.NodeAdapter to capture the instance
  const Faye = require("faye");
  const originalNodeAdapter = Faye.NodeAdapter;
  Faye.NodeAdapter = function(...args) {
    fayeAdapter = new originalNodeAdapter(...args);
    return fayeAdapter;
  };
  Faye.NodeAdapter.prototype = originalNodeAdapter.prototype;

  // Set up Faye with real auth extension (pass HTTP server, like production)
  const faye = require("../lib/faye");
  const fayeInstance = faye(server);
  bayeux = fayeInstance.bayeux;
  internalClient = fayeInstance.internalClient;

  // Restore original NodeAdapter
  Faye.NodeAdapter = originalNodeAdapter;

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
  // Disconnect internal client
  if (internalClient) {
    internalClient.disconnect();
  }

  // Close Faye's Redis connections
  if (fayeAdapter && fayeAdapter._server) {
    const fayeServer = fayeAdapter._server;

    if (fayeServer._engine && fayeServer._engine._engine) {
      const realEngine = fayeServer._engine._engine;

      // Close faye-redis-sharded connections
      if (realEngine._shardManagers) {
        realEngine._shardManagers.forEach(manager => {
          if (manager._shards) {
            const shards = Array.isArray(manager._shards)
              ? manager._shards
              : Object.values(manager._shards);

            shards.forEach(shard => {
              if (shard && shard.subscriber && shard.subscriber.quit) {
                shard.subscriber.quit();
              }
              if (shard && shard.redis && shard.redis.quit) {
                shard.redis.quit();
              }
            });
          }
        });
      }

      // Close faye-presence Redis connections
      if (realEngine._presence && realEngine._presence._engine) {
        const presenceEngine = realEngine._presence._engine;
        if (presenceEngine._redis) {
          const redisClients = Array.isArray(presenceEngine._redis)
            ? presenceEngine._redis
            : [presenceEngine._redis];
          redisClients.forEach(client => {
            if (client && client.quit) {
              client.quit();
            }
          });
        }
      }
    }
  }

  // Close HTTP server
  if (server) {
    await new Promise(resolve => {
      server.close(resolve);
    });
  }

  // Close all Redis clients that were created during setup
  allRedisClients.forEach(client => {
    if (client && client.quit) {
      client.quit();
    }
  });
  allRedisClients = [];

  // Stop store polling
  store.stop();

  // Destroy test-data's knex instance
  const testData = require("./test-data");
  await testData.knex.destroy();
}

module.exports = {
  setupTestServer,
  teardownTestServer
};
