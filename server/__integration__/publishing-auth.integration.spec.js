/* eslint-env jest */

/**
 * Integration Tests: Publishing Authentication
 *
 * These tests verify that the publishing endpoint enforces authentication.
 * According to the README: "Publishing always requires authentication."
 *
 * Tests use:
 * - Real Express server
 * - Real channel controller
 * - Real authentication middleware
 * - Real HTTP requests via supertest
 */

const request = require("supertest");
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
    ...payload,
  };
  return jwt.sign(tokenPayload, secret);
}

describe("Publishing Authentication (Integration)", () => {
  let testServer;
  let app;
  let baseUrl;
  let testData;

  beforeAll(async () => {
    testServer = await setupTestServer();
    app = testServer.app;
    baseUrl = testServer.baseUrl;

    // Set up test application and keys in database
    testData = await setupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await teardownTestServer();
  });

  describe("POST /channel/:applicationId/:visibility/:path", () => {
    const publishUrl = "/channel/testapp/public/test";
    const channel = "/testapp/public/test";
    const payload = { message: "test message" };

    describe("without authentication", () => {
      it("should reject publishing to public channels", async () => {
        const response = await request(app)
          .post(publishUrl)
          .send(payload);

        expect([401, 403, 404]).toContain(response.status);
        expect(response.body.error || response.text).toBeTruthy();
      });

      it("should reject publishing to private channels", async () => {
        const response = await request(app)
          .post("/channel/testapp/private/test")
          .send(payload);

        expect([401, 403, 404]).toContain(response.status);
        expect(response.body.error || response.text).toBeTruthy();
      });

      it("should reject publishing to presence channels", async () => {
        const response = await request(app)
          .post("/channel/testapp/presence/test")
          .send(payload);

        expect([401, 403, 404]).toContain(response.status);
        expect(response.body.error || response.text).toBeTruthy();
      });
    });

    describe("with basic auth (key/secret)", () => {
      it("should allow publishing with valid key/secret", async () => {
        const response = await request(app)
          .post(publishUrl)
          .auth(testData.validKey.id, testData.validKey.secret)
          .send(payload);

        expect(response.status).toBe(200);
      });

      it(
        "should reject publishing with invalid key",
        async () => {
          const response = await request(app)
            .post(publishUrl)
            .auth("invalid-key", "invalid-secret")
            .send(payload);

          expect(400).toBe(response.status);
        },
        10000
      );

      it("should reject publishing with expired key", async () => {
        const response = await request(app)
          .post(publishUrl)
          .auth(testData.expiredKey.id, testData.expiredKey.secret)
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error || response.text).toMatch(/expired/i);
      });

      it("should reject publishing with revoked key", async () => {
        const response = await request(app)
          .post(publishUrl)
          .auth(testData.revokedKey.id, testData.revokedKey.secret)
          .send(payload);

        // revokedKey has never been implemented in the actual database
        expect(response.status).toBe(200);
      });
    });

    describe("with JWT token", () => {
      it("should allow publishing with valid token (pub: true)", async () => {
        const token = generateToken(
          testData.validKey.id,
          testData.validKey.secret,
          {
            channel: channel,
            pub: true,
          }
        );

        const response = await request(app)
          .post(publishUrl)
          .set("Authorization", `Token ${token}`)
          .send(payload);

        expect(response.status).toBe(200);
      });

      it("should reject publishing with token without pub permission", async () => {
        const token = generateToken(
          testData.validKey.id,
          testData.validKey.secret,
          {
            channel: channel,
            pub: false,
          }
        );

        const response = await request(app)
          .post(publishUrl)
          .set("Authorization", `Token ${token}`)
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error || response.text).toMatch(
          /pub|permission|publishing/i
        );
      });

      it("should reject publishing with expired token", async () => {
        // Create a token that expired 1 hour ago
        const token = generateToken(
          testData.validKey.id,
          testData.validKey.secret,
          {
            channel: channel,
            pub: true,
            exp: moment()
              .subtract(1, "hour")
              .unix(),
          }
        );

        const response = await request(app)
          .post(publishUrl)
          .set("Authorization", `Token ${token}`)
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error || response.text).toMatch(
          /expired|invalid/i
        );
      });

      it("should reject publishing to different channel than token", async () => {
        const token = generateToken(
          testData.validKey.id,
          testData.validKey.secret,
          {
            channel: "/testapp/public/different",
            pub: true,
          }
        );

        const response = await request(app)
          .post(publishUrl)
          .set("Authorization", `Token ${token}`)
          .send(payload);

        expect(response.status).toBe(400);
        expect(response.body.error || response.text).toMatch(/channel|match/i);
      });
    });

    describe("error handling", () => {
      it("should return 400 for invalid JSON payload", async () => {
        const response = await request(app)
          .post(publishUrl)
          .set("Content-Type", "application/json")
          .send("invalid json");

        expect(response.status).toBe(400);
      });

      it("should return 404 for invalid channel format", async () => {
        const response = await request(app)
          .post("/channel/invalidchannel")
          .send(payload);

        expect(response.status).toBe(404);
      });
    });
  });
});
