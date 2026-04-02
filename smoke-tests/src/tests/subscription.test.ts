import { http } from "../lib/http";
import { generateToken } from "../lib/token";
import { subscribeAndWaitForMessage, expectSubscriptionRejected } from "../lib/pubsub";
import { waitForReady } from "../lib/readiness";
import { config } from "../config";

beforeAll(async () => {
  await waitForReady();
});

describe("Subscription", () => {
  const uniqueId = Date.now();

  describe("pub/sub round-trip", () => {
    it("should receive a published message on a public channel", async () => {
      const channel = `/${config.appId}/public/smoke-roundtrip-${uniqueId}`;
      const publishUrl = `/channel/${config.appId}/public/smoke-roundtrip-${uniqueId}`;

      const received = await subscribeAndWaitForMessage({
        fayeUrl: config.fayeUrl,
        channel,
        onSubscribed: () =>
          http.post(publishUrl, { text: "round-trip smoke-test" }, {
            auth: { username: config.keyId, password: config.keySecret },
          }),
      });

      expect(received).toMatchObject({ text: "round-trip smoke-test" });
    });
  });

  describe("private channels", () => {
    it("should allow subscription with valid JWT", async () => {
      const channel = `/${config.appId}/private/smoke-private-${uniqueId}`;
      const publishUrl = `/channel/${config.appId}/private/smoke-private-${uniqueId}`;
      const subToken = generateToken(config.keyId, config.keySecret, {
        channel,
        sub: true,
      });
      const pubToken = generateToken(config.keyId, config.keySecret, {
        channel,
        pub: true,
      });

      const received = await subscribeAndWaitForMessage({
        fayeUrl: config.fayeUrl,
        channel,
        token: subToken,
        onSubscribed: () =>
          http.post(publishUrl, { text: "private channel smoke-test" }, {
            headers: { Authorization: `Token ${pubToken}` },
          }),
      });

      expect(received).toMatchObject({ text: "private channel smoke-test" });
    });

    it("should reject subscription without authentication", async () => {
      const channel = `/${config.appId}/private/smoke-noauth-${uniqueId}`;

      const error = await expectSubscriptionRejected({
        fayeUrl: config.fayeUrl,
        channel,
      });

      expect(error.message).toBe("No auth supplied");
    });
  });
});
