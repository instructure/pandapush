import { http } from "../lib/http";
import { waitForReady } from "../lib/readiness";
import { config } from "../config";
import { describeIf } from "../lib/describe";

beforeAll(async () => {
  await waitForReady();
});

const describe = describeIf(config.environment === "local" && config.adminAuth);

describe("Admin API", () => {
  const auth = config.adminAuth!;
  let applicationId: string;
  let keyId: string;

  describe("create application", () => {
    it("should create a new application", async () => {
      const res = await http.post(
        "/admin/api/applications",
        { name: "Smoke Test App" },
        { auth: { username: auth.username, password: auth.password } },
      );

      expect(res).toMatchObject({
        status: 201,
        data: {
          id: expect.any(String),
          name: "Smoke Test App",
        }
      });

      applicationId = res.data.id;
    });
  });

  describe("create key", () => {
    it("should generate a key for the application", async () => {
      const res = await http.post(
        `/admin/api/application/${applicationId}/keys`,
        {
          expires: new Date(Date.now() + 3600_000).toISOString(),
          purpose: "smoke-test",
        },
        { auth: { username: auth.username, password: auth.password } },
      );

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        id: expect.any(String),
        secret: expect.any(String),
      });

      keyId = res.data.id;
    });
  });

  describe("generate token", () => {
    it("should generate a JWT for the application", async () => {
      const res = await http.post(
        `/admin/api/application/${applicationId}/keys/${keyId}/token`,
        {
          channel: `/${applicationId}/public/smoke-test`,
          pub: true,
          sub: true,
        },
        { auth: { username: auth.username, password: auth.password } },
      );

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        token: expect.any(String),
      });
    });
  });

  describe("delete application", () => {
    it("should delete the application", async () => {
      const res = await http.delete(
        `/admin/api/application/${applicationId}`,
        { auth: { username: auth.username, password: auth.password } },
      );

      expect(res).toMatchObject({
        status: 200,
        data: "OK",
      });
    });

    it("should confirm the application no longer exists", async () => {
      const res = await http.get(
        `/admin/api/application/${applicationId}`,
        { auth: { username: auth.username, password: auth.password } },
      );

      expect(res).toMatchObject({
        status: 404,
        data: "Not found",
      });
    });
  });
});
