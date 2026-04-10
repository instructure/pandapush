import { http } from "./http";

const defaultMaxAttempts = Number(process.env.SMOKE_TEST_HOOK_TIMEOUT_SECONDS) || 60;

export async function waitForReady(
  maxAttempts = defaultMaxAttempts,
  intervalMs = 1000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await http.get("/health_check.json");
      if (res.status === 200) {
        return;
      }
    } catch {
      // Connection refused, etc. — keep trying.
    }
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  throw new Error(
    `service not ready after ${maxAttempts} attempts (${maxAttempts}s)`,
  );
}
