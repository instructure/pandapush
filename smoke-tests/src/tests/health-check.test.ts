import { http } from "../lib/http";
import { waitForReady } from "../lib/readiness";

beforeAll(async () => {
  await waitForReady();
});

describe("Health Check", () => {
  it("should return 200 with version info", async () => {
    const res = await http.get("/health_check.json");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.data).toMatchObject({
      version: expect.any(String),
      rev: expect.any(String),
      built: expect.any(String),
    });
  });
});
