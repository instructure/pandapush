import { defineConfig } from "vitest/config";

const hookTimeoutSeconds = Number(process.env.SMOKE_TEST_HOOK_TIMEOUT_SECONDS) || 60;

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 30_000,
    hookTimeout: hookTimeoutSeconds * 1000,
    setupFiles: ["dotenv/config"],
  },
});
