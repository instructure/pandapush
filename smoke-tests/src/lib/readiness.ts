import { http } from "./http";

export async function waitForReady(
  maxAttempts = 30,
  intervalMs = 1000,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await http.get("/health_check.json");
      if (res.status === 200) return;
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
