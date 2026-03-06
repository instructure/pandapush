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

  // Wait for cache to be populated with our test keys by polling
  // This section is to avoid flakiness in tests where keys aren't cached yet when the test runs
  const maxAttempts = 200; // 10 seconds max
  const delayMs = 50; // Check every 50ms

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, delayMs));

    // Check if our keys are in the cache
    const cachedValidKey = store.getKeyCachedSync(testAppId, validKey.id);
    const cachedExpiredKey = store.getKeyCachedSync(testAppId, expiredKey.id);
    const cachedRevokedKey = store.getKeyCachedSync(testAppId, revokedKey.id);

    if (cachedValidKey && cachedExpiredKey && cachedRevokedKey) {
      // All keys are cached, we're ready
      const waitedMs = (attempt + 1) * delayMs;
      console.log(`Test keys cached successfully after ${waitedMs}ms`);
      break;
    }

    if (attempt === maxAttempts - 1) {
      console.warn(
        "Warning: Test keys may not be fully cached after 10 seconds"
      );
      console.warn("Cache status:", {
        validKey: !!cachedValidKey,
        expiredKey: !!cachedExpiredKey,
        revokedKey: !!cachedRevokedKey
      });
    }
  }

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
  cleanupTestData,
  knex
};
