const {
  cleanupTestApplications,
  closeConnection
} = require("./fixtures/db-cleanup");

module.exports = async () => {
  console.log("🚀 E2E Global Setup: Starting...");

  // Wait for web service to be ready
  const baseURL = process.env.E2E_BASE_URL || "http://web:3000";
  const maxRetries = 30;
  const retryDelay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(`${baseURL}/health_check.json`);
      if (response.ok) {
        console.log("✅ E2E Global Setup: Web service is ready");
        break;
      }
      console.log(
        `⏳ Attempt ${i + 1}/${maxRetries}: Service returned status ${
          response.status
        }`
      );
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error("❌ Last error:", error.message);
        throw new Error(
          `Web service not ready after ${maxRetries} attempts. Last error: ${
            error.message
          }`
        );
      }
      if (i % 5 === 0) {
        console.log(
          `⏳ Attempt ${i + 1}/${maxRetries}: Waiting for service... (${
            error.message
          }`
        );
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  try {
    console.log("🧹 Cleaning up leftover test data...");
    await cleanupTestApplications();
  } catch (error) {
    console.error("⚠️  Pre-cleanup failed:", error.message);
    // Don't fail setup if cleanup fails - might be first run
  } finally {
    await closeConnection();
  }

  console.log("✅ E2E Global Setup: Complete");
};
