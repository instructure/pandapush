/* eslint-env jest */

/**
 * Integration Tests: Health Check
 *
 * These tests verify that the health check endpoint works correctly.
 *
 */

const request = require("supertest");
const { setupTestServer, teardownTestServer } = require("./setup");

describe("Health Check (Integration)", () => {
  let testServer;
  let app;

  beforeAll(async () => {
    testServer = await setupTestServer();
    app = testServer.app;
  });

  afterAll(async () => {
    await teardownTestServer(testServer);
  });

  describe("GET /health_check.json", () => {
    it("should return 200 status", async () => {
      const response = await request(app).get("/health_check.json");

      expect(response.status).toBe(200);
    });

    it("should return JSON with version, rev, and built fields", async () => {
      const response = await request(app).get("/health_check.json");

      expect(response.body).toHaveProperty("version");
      expect(response.body).toHaveProperty("rev");
      expect(response.body).toHaveProperty("built");
    });

    it("should return version matching package.json", async () => {
      const pkg = require("../../package.json");
      const response = await request(app).get("/health_check.json");

      expect(response.body.version).toBe(pkg.version);
    });

    it("should return valid content-type header", async () => {
      const response = await request(app).get("/health_check.json");

      expect(response.headers["content-type"]).toMatch(/application\/json/);
    });

    it("should respond quickly (performance check)", async () => {
      const startTime = Date.now();
      await request(app).get("/health_check.json");
      const duration = Date.now() - startTime;

      // Health check should respond in less than 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});
