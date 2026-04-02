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

  describe("pub/sub round-trip on public channel", () => {
    it("should receive a published message", async () => {
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
    describe("with valid JWT", () => {
      it("should allow subscription", async () => {
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
    });

    describe("without authentication", () => {
      it("should reject subscription", async () => {
        const channel = `/${config.appId}/private/smoke-noauth-${uniqueId}`;

        const error = await expectSubscriptionRejected({
          fayeUrl: config.fayeUrl,
          channel,
        });

        expect(error.message).toBe("No auth supplied");
      });
    });

    describe("with expired token", () => {
      it("should reject subscription", async () => {
        const channel = `/${config.appId}/private/smoke-expired-${uniqueId}`;
        const token = generateToken(config.keyId, config.keySecret, {
          channel,
          sub: true,
          exp: Math.floor(Date.now() / 1000) - 3600,
        });

        const error = await expectSubscriptionRejected({
          fayeUrl: config.fayeUrl,
          channel,
          token,
        });

        expect(error.message).toMatch(/expired|invalid/i);
      });
    });

    describe("with token scoped for wrong channel", () => {
      it("should reject subscription", async () => {
        const channel = `/${config.appId}/private/smoke-wrongchan-${uniqueId}`;
        const token = generateToken(config.keyId, config.keySecret, {
          channel: `/${config.appId}/private/different-channel`,
          sub: true,
        });

        const error = await expectSubscriptionRejected({
          fayeUrl: config.fayeUrl,
          channel,
          token,
        });

        expect(error.message).toMatch(/channel|match/i);
      });
    });
  });
});
