const knexConfig = require("./knexfile");

let knexInstance = null;

/**
 * Get or create a knex connection
 */
function getKnex() {
  if (!knexInstance) {
    knexInstance = require("knex")(knexConfig);
  }
  return knexInstance;
}

/**
 * Clean up test applications and their related data
 */
async function cleanupTestApplications() {
  const knex = getKnex();

  try {
    // Find all test applications (created by our test fixtures)
    const testApps = await knex("applications")
      .where("name", "like", "test-app-%")
      .select("id");

    if (testApps.length === 0) {
      console.log("✨ No test applications to clean up");
      return { deleted: 0 };
    }

    const appIds = testApps.map(app => app.id);
    console.log(`🧹 Cleaning up ${appIds.length} test application(s)...`);

    await knex.transaction(async trx => {
      const deletedKeys = await trx("keys")
        .whereIn("application_id", appIds)
        .del();

      const deletedUsers = await trx("application_users")
        .whereIn("application_id", appIds)
        .del();

      const deletedApps = await trx("applications")
        .whereIn("id", appIds)
        .del();

      console.log(`  ✓ Deleted ${deletedKeys} key(s)`);
      console.log(`  ✓ Deleted ${deletedUsers} application_user(s)`);
      console.log(`  ✓ Deleted ${deletedApps} application(s)`);
    });

    return { deleted: appIds.length };
  } catch (error) {
    console.error("❌ Error during cleanup:", error.message);
    throw error;
  }
}

/**
 * Close the database connection and reset instance
 */
async function closeConnection() {
  if (knexInstance) {
    await knexInstance.destroy();
    knexInstance = null;
  }
}

module.exports = {
  cleanupTestApplications,
  closeConnection,
  getKnex
};
