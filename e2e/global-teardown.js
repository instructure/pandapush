const {
  cleanupTestApplications,
  closeConnection
} = require("./fixtures/db-cleanup");

module.exports = async () => {
  console.log("🧹 E2E Global Teardown: Cleaning up...");

  try {
    await cleanupTestApplications();
  } catch (error) {
    console.error("⚠️  Cleanup failed:", error.message);
  } finally {
    await closeConnection();
  }

  console.log("✅ E2E Global Teardown: Complete");
};
