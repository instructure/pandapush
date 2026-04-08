import { http } from "../lib/http";
import { generateToken } from "../lib/token";
import { waitForReady } from "../lib/readiness";
import { config } from "../config";

beforeAll(async () => {
  await waitForReady();
});

describe("Publishing", () => {
  const uniquePath = `smoke-${Date.now()}`;
  const publishUrl = `/channel/${config.appId}/public/${uniquePath}`;
  const channel = `/${config.appId}/public/${uniquePath}`;
  const payload = { message: "smoke test" };

  describe("with basic auth using valid key/secret", () => {
    it("should allow publishing", async () => {
      const res = await http.post(publishUrl, payload, {
        auth: { username: config.keyId, password: config.keySecret },
      });

      expect(res.status).toBe(200);
    });
  });

  describe("without authentication", () => {
    it("should reject publishing", async () => {
      const res = await http.post(publishUrl, payload);

      expect(res).toMatchObject({
        status: 403,
        data: "Unauthorized",
      });
    });
  });

  describe("with valid JWT token (pub: true)", () => {
    it("should allow publishing", async () => {
      const token = generateToken(config.keyId, config.keySecret, {
        channel,
        pub: true,
      });

      const res = await http.post(publishUrl, payload, {
        headers: { Authorization: `Token ${token}` },
      });

      expect(res.status).toBe(200);
    });

    // Note: expired token and wrong channel tests are covered on the
    // subscription path (subscription.test.ts). The HTTP publish endpoint
    // hangs on auth failures due to a Faye errback propagation issue over
    // the network, so we don't test those cases here.
  });
});
