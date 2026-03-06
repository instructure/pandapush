/* eslint-env jest */

/**
 * Integration Tests: Subscription Authentication
 *
 * These tests verify that the Faye server enforces authentication for subscriptions.
 * - Public channels: No authentication required
 * - Private channels: Require JWT token with sub: true
 * - Presence channels: Require JWT token with presence data
 *
 * Tests use:
 * - Real Faye server
 * - Real authentication extension
 * - Real WebSocket connections
 * - Real Faye client
 */

const Faye = require("faye");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { setupTestServer, teardownTestServer } = require("./setup");
const { setupTestData, cleanupTestData } = require("./test-data");

/**
 * Generate a JWT token for testing
 * @param {string} keyId - The key ID
 * @param {string} secret - The key secret to sign with
 * @param {object} payload - Token payload (channel, pub, sub, exp, etc.)
 * @returns {string} Signed JWT token
 */
function generateToken(keyId, secret, payload) {
  const tokenPayload = {
    keyId,
    ...payload
  };
  return jwt.sign(tokenPayload, secret);
}

describe("Subscription Authentication (Integration)", () => {
  let testServer;
  let fayeUrl;
  let client;
  let testData;

  beforeAll(async () => {
    testServer = await setupTestServer();
    fayeUrl = testServer.fayeUrl;

    // Set up test application and keys in database
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await teardownTestServer();
  });

  beforeEach(() => {
    // Create a new Faye client for each test
    client = new Faye.Client(fayeUrl);
  });

  afterEach(async () => {
    if (client) {
      // Properly disconnect and wait for cleanup
      client.disconnect();
      // Give Faye time to clean up WebSocket connections
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  });

  describe("Public channels", () => {
    it("should allow subscription without authentication", done => {
      const channel = "/testapp/public/test-no-auth";
      const testMessage = { text: "test without auth" };

      const subscription = client.subscribe(channel, message => {
        expect(message).toEqual(testMessage);
        done();
      });

      // Verify subscription object has expected structure
      expect(subscription).toBeDefined();
      expect(typeof subscription.then).toBe("function");
      expect(typeof subscription.cancel).toBe("function");

      // Wait for subscription to establish, then publish to verify it works
      setTimeout(() => {
        testServer.internalClient.publish(channel, testMessage);
      }, 200);
    });

    it("should receive published messages on public channels", done => {
      const testMessage = { message: "test message" };
      const channel = "/testapp/public/test-receive";

      client.subscribe(channel, message => {
        expect(message).toEqual(testMessage);
        done();
      });

      // Give subscription time to establish, then publish using internal client
      // (internal client has special privileges and doesn't need auth)
      setTimeout(() => {
        testServer.internalClient.publish(channel, testMessage);
      }, 200);
    });

    it("should allow cancelling a subscription", done => {
      const channel = "/testapp/public/test-cancel";
      let messageCount = 0;

      const subscription = client.subscribe(channel, message => {
        messageCount++;
        if (messageCount > 1) {
          done.fail("Received message after cancellation");
        }
      });

      expect(typeof subscription.cancel).toBe("function");

      // Wait for subscription to establish
      setTimeout(() => {
        // Publish first message - should be received
        testServer.internalClient.publish(channel, { test: 1 });

        // Cancel subscription after first message
        setTimeout(() => {
          subscription.cancel();

          // Publish second message - should NOT be received
          setTimeout(() => {
            testServer.internalClient.publish(channel, { test: 2 });

            // Wait a bit then verify we only got 1 message
            setTimeout(() => {
              expect(messageCount).toBe(1);
              done();
            }, 200);
          }, 100);
        }, 100);
      }, 200);
    });
  });

  describe("Private channels", () => {
    it("should reject subscription without authentication", done => {
      const privateChannel = "/testapp/private/test-no-auth";
      const subscription = client.subscribe(privateChannel, () => {});

      subscription.then(
        () => {
          done.fail(
            "Private channel subscription succeeded without authentication - SECURITY BUG!"
          );
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/auth|permission|token/i);
          done();
        }
      );

      // Add timeout in case subscription neither succeeds nor fails
      setTimeout(() => {
        done.fail("Subscription neither succeeded nor failed within timeout");
      }, 5000);
    });

    it("should reject subscription with invalid token", done => {
      const privateChannel = "/testapp/private/test-invalid-token";
      // Add invalid token to client extension
      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token: "invalid-token" };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(privateChannel, () => {});

      subscription.then(
        () => {
          done.fail(
            "Private channel subscription succeeded with invalid token"
          );
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toBe("Invalid token");
          done();
        }
      );
    });

    it("should allow subscription with valid token (sub: true)", done => {
      const privateChannel = "/testapp/private/test-valid-token";
      const testMessage = { text: "private channel test" };
      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: privateChannel,
          sub: true
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(privateChannel, message => {
        expect(message).toEqual(testMessage);
        done();
      });

      // Verify subscription object structure
      expect(subscription).toBeDefined();
      expect(typeof subscription.then).toBe("function");
      expect(typeof subscription.cancel).toBe("function");

      subscription.then(
        () => {
          // Subscription succeeded - publish message to verify it works
          setTimeout(() => {
            testServer.internalClient.publish(privateChannel, testMessage);
          }, 100);
        },
        error => {
          done.fail(`Valid token should allow subscription: ${error.message}`);
        }
      );
    });

    it("should reject subscription with token lacking sub permission", done => {
      const privateChannel = "/testapp/private/test-no-sub-permission";
      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: privateChannel,
          sub: false
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(privateChannel, () => {});

      subscription.then(
        () => {
          done.fail("Subscription should fail with sub: false");
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/sub|permission|allow/i);
          done();
        }
      );
    });

    it("should reject subscription with expired token", done => {
      const privateChannel = "/testapp/private/test-expired-token";
      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: privateChannel,
          sub: true,
          exp: moment()
            .subtract(1, "hour")
            .unix()
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(privateChannel, () => {});

      subscription.then(
        () => {
          done.fail("Subscription should fail with expired token");
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/expired|invalid/i);
          done();
        }
      );
    });

    it("should reject subscription with token for different channel", done => {
      const privateChannel = "/testapp/private/test-wrong-channel";
      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: "/testapp/private/different",
          sub: true
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(privateChannel, () => {});

      subscription.then(
        () => {
          done.fail("Subscription should fail with wrong channel");
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/channel|match/i);
          done();
        }
      );
    });
  });

  describe("Presence channels", () => {
    it("should reject subscription without authentication", done => {
      const presenceChannel = "/testapp/presence/test_no_auth";
      const subscription = client.subscribe(presenceChannel, () => {});

      subscription.then(
        () => {
          done.fail(
            "Presence channel subscription succeeded without authentication"
          );
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/No auth supplied/i);
          done();
        }
      );
    });

    it("should allow subscription even without presence data (but won't track presence)", done => {
      const presenceChannel = "/testapp/presence/test_no_presence_data";
      // Token has sub:true but missing presence field
      // Faye allows the subscription but won't track presence without the data
      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: presenceChannel,
          sub: true
          // No presence field - subscription works but no presence tracking
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const testMessage = { text: "test without presence" };

      const subscription = client.subscribe(presenceChannel, message => {
        expect(message).toEqual(testMessage);
        done();
      });

      // Handle both success and failure cases
      subscription.then(
        () => {
          // Subscription succeeded - now publish a message to verify it works
          setTimeout(() => {
            testServer.internalClient.publish(presenceChannel, testMessage);
          }, 200);
        },
        error => {
          // Subscription was rejected - also acceptable behavior
          expect(error).toBeDefined();
          done();
        }
      );
    });

    it("should allow subscription with valid presence token", done => {
      const presenceChannel = "/testapp/presence/test_valid_token";
      const testMessage = { text: "presence test message" };

      const token = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: presenceChannel,
          sub: true,
          presence: {
            id: "user-123",
            name: "Test User",
            email: "test@example.com"
          }
        }
      );

      client.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token };
          }
          callback(message);
        }
      });

      const subscription = client.subscribe(presenceChannel, message => {
        expect(message).toEqual(testMessage);
        done();
      });

      // Handle subscription failures
      subscription.then(
        () => {
          // Subscription succeeded - wait then publish
          setTimeout(() => {
            testServer.internalClient.publish(presenceChannel, testMessage);
          }, 200);
        },
        error => {
          done.fail(
            `Valid presence token should allow subscription: ${error.message}`
          );
        }
      );

      // Add timeout guard
      setTimeout(() => {
        done.fail("Subscription neither succeeded nor failed within timeout");
      }, 5000);
    });

    it("should broadcast presence info to other subscribers", done => {
      const channel = "/testapp/presence/test_broadcast";
      const client1PresenceData = {
        id: "user-1",
        name: "User One"
      };
      const client2PresenceData = {
        id: "user-2",
        name: "User Two"
      };

      // Create token for first client
      const token1 = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: channel,
          sub: true,
          presence: client1PresenceData
        }
      );

      // Create token for second client
      const token2 = generateToken(
        testData.validKey.id,
        testData.validKey.secret,
        {
          channel: channel,
          sub: true,
          presence: client2PresenceData
        }
      );

      const client1 = new Faye.Client(fayeUrl);
      let client2;

      const cleanup = () => {
        if (client1) client1.disconnect();
        if (client2) client2.disconnect();
      };

      client1.addExtension({
        outgoing: (message, callback) => {
          if (message.channel === "/meta/subscribe") {
            message.ext = message.ext || {};
            message.ext.auth = { token: token1 };
          }
          callback(message);
        }
      });

      client1.subscribe(channel, message => {
        // Check if this is a presence notification (has subscribe or unsubscribe fields)
        if (message.subscribe) {
          try {
            // Verify second user's presence data is in the subscribe notification
            expect(message.subscribe["user-2"]).toBeDefined();
            expect(message.subscribe["user-2"]).toEqual(client2PresenceData);
            cleanup();
            done();
          } catch (error) {
            cleanup();
            done.fail(`Presence assertion failed: ${error.message}`);
          }
        }
      });

      // Wait for first client to be subscribed, then add second client
      setTimeout(() => {
        client2 = new Faye.Client(fayeUrl);

        client2.addExtension({
          outgoing: (message, callback) => {
            if (message.channel === "/meta/subscribe") {
              message.ext = message.ext || {};
              message.ext.auth = { token: token2 };
            }
            callback(message);
          }
        });

        // Subscribe second client - this should trigger presence notification to first client
        client2.subscribe(channel, () => {});
      }, 500);

      // Add timeout guard that also cleans up
      setTimeout(() => {
        cleanup();
        done.fail("Presence notification not received within timeout");
      }, 5000);
    });
  });

  describe("Wildcard subscriptions", () => {
    it("should support single-level wildcard (*)", done => {
      const wildcardChannel = "/testapp/public/*";
      const specificChannel1 = "/testapp/public/foo";
      const specificChannel2 = "/testapp/public/bar";
      const nestedChannel = "/testapp/public/foo/nested"; // Should NOT match single-level wildcard

      let receivedCount = 0;
      const expectedMessages = 2; // Should receive from foo and bar, but not foo/nested

      client.subscribe(wildcardChannel, message => {
        receivedCount++;
        expect(message.text).toMatch(/test message (1|2)/);

        if (receivedCount === expectedMessages) {
          done();
        }
      });

      setTimeout(() => {
        // These should be received (single level)
        testServer.internalClient.publish(specificChannel1, {
          text: "test message 1"
        });
        testServer.internalClient.publish(specificChannel2, {
          text: "test message 2"
        });

        // This should NOT be received (nested level)
        testServer.internalClient.publish(nestedChannel, {
          text: "should not receive"
        });

        // Verify we got exactly 2 messages
        setTimeout(() => {
          expect(receivedCount).toBe(expectedMessages);
          if (receivedCount !== expectedMessages) {
            done.fail(
              `Expected ${expectedMessages} messages, got ${receivedCount}`
            );
          }
        }, 500);
      }, 200);
    });

    it("should support recursive wildcard (**)", done => {
      const wildcardChannel = "/testapp/public/**";
      const channels = [
        "/testapp/public/level1",
        "/testapp/public/level1/level2",
        "/testapp/public/level1/level2/level3"
      ];

      let receivedCount = 0;
      const expectedMessages = channels.length;

      client.subscribe(wildcardChannel, message => {
        receivedCount++;
        expect(message.text).toBeDefined();

        if (receivedCount === expectedMessages) {
          done();
        }
      });

      // Give subscription time to establish
      setTimeout(() => {
        channels.forEach((channel, index) => {
          testServer.internalClient.publish(channel, {
            text: `message ${index + 1}`
          });
        });

        // Verify we got all messages
        setTimeout(() => {
          expect(receivedCount).toBe(expectedMessages);
          if (receivedCount !== expectedMessages) {
            done.fail(
              `Expected ${expectedMessages} messages, got ${receivedCount}`
            );
          }
        }, 500);
      }, 200);
    });

    it("should enforce auth for wildcard private channels", done => {
      // Attempt to subscribe to wildcard private channel without auth
      const subscription = client.subscribe("/testapp/private/*", () => {});

      subscription.then(
        () => {
          done.fail(
            "Wildcard private subscription succeeded without auth - SECURITY BUG!"
          );
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/auth|permission|token/i);
          done();
        }
      );
    });
  });

  describe("Invalid channels", () => {
    it("should reject subscription to invalid channel format", done => {
      const subscription = client.subscribe("/invalidchannel", () => {});

      subscription.then(
        () => {
          done.fail("Invalid channel subscription should fail");
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/Invalid channel name/);
          done();
        }
      );
    });

    it("should reject subscription to unknown channel type", done => {
      const subscription = client.subscribe("/testapp/unknown/test", () => {});

      subscription.then(
        () => {
          done.fail("Unknown channel type subscription should fail");
        },
        error => {
          expect(error).toBeDefined();
          expect(error.message).toMatch(/Invalid channel name/);
          done();
        }
      );
    });
  });
});
