/**
 * Test Data Setup
 *
 * Creates applications and keys in the database for integration testing
 */

const store = require("../lib/store");
const moment = require("moment");
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig.test || knexConfig.development);

/**
 * Creates a test application with various keys for testing
 */
async function setupTestData() {
  const testAppId = "testapp";
  const testUserId = "test-user";

  await cleanupTestData();
  const app = await store.addApplication("Test Application", testUserId);

  await knex("applications")
    .where("id", app.id)
    .update({ id: testAppId });

  const validKey = await store.addKey(
    testAppId,
    moment()
      .add(1, "year")
      .toISOString(),
    "test-valid",
    testUserId
  );

  const expiredKey = await store.addKey(
    testAppId,
    moment()
      .subtract(1, "day")
      .toISOString(),
    "test-expired",
    testUserId
  );

  // Create key that will be revoked - this actually doesn't exist in pandapush but dead code references it
  const revokedKey = await store.addKey(
    testAppId,
    moment()
      .add(1, "year")
      .toISOString(),
    "test-revoked",
    testUserId
  );

  // Manually revoke the key by setting revoked_at
  // First check if column exists, if not, skip revocation test
  try {
    await knex("keys")
      .where("id", revokedKey.id)
      .update({ revoked_at: moment().toISOString() });
  } catch (err) {
    console.log("Note: revoked_at column may not exist, skipping revocation");
  }

  // Cache will be automatically reloaded by store's polling mechanism
  // Give it a moment to populate
  await new Promise(resolve => setTimeout(resolve, 100));

  return {
    applicationId: testAppId,
    validKey: {
      id: validKey.id,
      secret: validKey.secret
    },
    expiredKey: {
      id: expiredKey.id,
      secret: expiredKey.secret
    },
    revokedKey: {
      id: revokedKey.id,
      secret: revokedKey.secret
    }
  };
}

/**
 * Cleans up test data from the database
 */
async function cleanupTestData() {
  const testAppId = "testapp";

  try {
    // Delete all keys
    await knex("keys")
      .where("application_id", testAppId)
      .del();

    // Delete users
    await knex("application_users")
      .where("application_id", testAppId)
      .del();

    // Delete test application
    await knex("applications")
      .where("id", testAppId)
      .del();
  } catch (err) {
    // Ignore errors if data doesn't exist
    console.log("Cleanup note:", err.message);
  }
}

module.exports = {
  setupTestData,
  cleanupTestData
};
