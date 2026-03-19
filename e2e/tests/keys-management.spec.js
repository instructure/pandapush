/**
 * Keys Management E2E Tests
 *
 * Tests for creating and managing API keys through the admin UI.
 *
 * Test data cleanup:
 * - Global setup/teardown automatically cleans up test applications (test-app-*)
 * - Keys are cascade deleted when their parent application is deleted
 */
const { expect } = require("@playwright/test");
const { test } = require("../fixtures/auth-fixtures");
const ApplicationsListPage = require("../page-objects/ApplicationsListPage");
const ApplicationDetailsPage = require("../page-objects/ApplicationDetailsPage");
const KeysPage = require("../page-objects/KeysPage");

/**
 * Helper function to get a future date for key expiration
 * @param {number} daysFromNow - Number of days in the future
 * @returns {object} Object with date and time strings formatted for DateTimeInput
 */
function getFutureDate(daysFromNow = 30) {
  const future = new Date();
  future.setDate(future.getDate() + daysFromNow);

  // Format: MM/DD/YYYY
  const month = String(future.getMonth() + 1).padStart(2, "0");
  const day = String(future.getDate()).padStart(2, "0");
  const year = future.getFullYear();
  const date = `${month}/${day}/${year}`;

  // Format: HH:MM AM/PM
  let hours = future.getHours();
  const minutes = String(future.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${ampm}`;

  return { date, time };
}

test.describe("Keys Management", () => {
  test.describe("Create Key Flow", () => {
    test("should create a new key and display it in the keys table", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-keys-${Date.now()}`;
      const keyPurpose = "Test Key for E2E";

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);

      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      const keyCredentials = await keysPage.createKey(
        keyPurpose,
        getFutureDate(30)
      );

      // Key credentials were returned
      expect(keyCredentials).toBeDefined();
      expect(keyCredentials.id).toBeTruthy();
      expect(keyCredentials.secret).toBeTruthy();

      // Verify key appears in the table
      const hasKey = await keysPage.hasKey(keyCredentials.id);
      expect(hasKey).toBe(true);

      // Verify key details in table
      const key = await keysPage.getKeyByPurpose(keyPurpose);
      expect(key).toBeDefined();
      expect(key.id).toBe(keyCredentials.id);
      expect(key.status).toContain("active");
      expect(key.created).toContain("admin");
    });

    test("should display key ID and secret in alert after creation", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-key-alert-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      const keyCredentials = await keysPage.createKey(
        "Alert Test Key",
        getFutureDate(7)
      );

      // Verify both ID and secret are present (critical for user)
      expect(keyCredentials.id).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(keyCredentials.secret).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(keyCredentials.id.length).toBeGreaterThan(10);
      expect(keyCredentials.secret.length).toBeGreaterThan(10);
    });

    test("should support creating multiple keys for one application", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-multi-keys-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      // We have one initial key, web console
      // BUT it will be displayed on the UI only after a refresh / new key addition
      // TODO: this is a race condition bug, we should fix it.
      const initialKeys = await keysPage.getKeys();
      const initialCount = initialKeys.length;

      // Create three keys with different purposes
      const key1 = await keysPage.createKey(
        "Production Key",
        getFutureDate(90)
      );
      const key2 = await keysPage.createKey("Staging Key", getFutureDate(60));
      const key3 = await keysPage.createKey(
        "Development Key",
        getFutureDate(30)
      );

      // Verify all three keys we created are in the table
      const keys = await keysPage.getKeys();
      expect(keys.length).toBe(initialCount + 3);

      const keyIds = keys.map(key => key.id);
      expect(keyIds).toContain(key1.id);
      expect(keyIds).toContain(key2.id);
      expect(keyIds).toContain(key3.id);

      // Verify purposes are preserved
      const purposes = keys.map(k => k.purpose);
      expect(purposes).toContain("Production Key");
      expect(purposes).toContain("Staging Key");
      expect(purposes).toContain("Development Key");
    });

    test("should disable submit button when required fields are empty", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-validation-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);
      await keysPage.clickNewKey();

      // Submit should be disabled with empty fields
      const isDisabled = await keysPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    test("should enable submit button when all required fields are filled", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-enable-submit-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);
      await keysPage.clickNewKey();

      // Fill in the required fields
      await keysPage.fillKeyDetails("Test Purpose", getFutureDate(30));

      // Submit should now be enabled
      const isDisabled = await keysPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(false);
    });

    test("should close new key modal without creating key", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-cancel-key-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      const initialCount = await keysPage.getTableRowCount();

      // Open modal and close without creating
      await keysPage.clickNewKey();

      // Modal should be visible
      await expect(
        authenticatedPage.getByRole("heading", { name: "Create New Key" })
      ).toBeVisible();

      await keysPage.closeModal();

      // Verify no key was created
      const finalCount = await keysPage.getTableRowCount();
      expect(finalCount).toBe(initialCount);
    });
  });

  test.describe("Keys Display and Status", () => {
    test("should display key status as active for newly created keys", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-status-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      await keysPage.createKey("Active Status Test", getFutureDate(30));

      const key = await keysPage.getKeyByPurpose("Active Status Test");
      expect(key.status).toContain("active");
    });

    test("should display key expiration date", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-expiration-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      await keysPage.createKey("Expiration Test", getFutureDate(7));

      const key = await keysPage.getKeyByPurpose("Expiration Test");
      // Should show relative time like "in 7 days"
      expect(key.expires).toBeTruthy();
      expect(key.expires).toContain("in");
    });

    test("should display creation info with username", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-creator-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      await keysPage.createKey("Creator Test", getFutureDate(30));

      const key = await keysPage.getKeyByPurpose("Creator Test");
      // Created column should show relative time and creator username
      expect(key.created).toContain("admin");
    });

    test("should display empty usage statistics for new keys", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-usage-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      await keysPage.createKey("Usage Test", getFutureDate(30));

      const key = await keysPage.getKeyByPurpose("Usage Test");
      // New keys have NULL use_count and last_used in DB, both render as empty string
      expect(key.lastUsed).toBe("");
      expect(key.used).toBe("");
    });
  });

  test.describe("Initial State", () => {
    test("should display keys tab with New Key button available", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-initial-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      await expect(
        authenticatedPage.getByRole("button", { name: "New Key" })
      ).toBeVisible();

      const keyCredentials = await keysPage.createKey(
        "First Manual Key",
        getFutureDate(30)
      );
      expect(keyCredentials).toBeDefined();
      expect(keyCredentials.id).toBeTruthy();
    });
  });

  test.describe("Navigation", () => {
    test("should navigate directly to keys tab via URL", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-direct-nav-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      expect(authenticatedPage.url()).toContain(
        `/admin/application/${appId}/keys`
      );

      await expect(
        authenticatedPage.getByRole("button", { name: "New Key" })
      ).toBeVisible();
    });

    test("should persist keys when navigating back from other tabs", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const keysPage = new KeysPage(authenticatedPage);
      const appName = `test-app-persist-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);
      const appId = await detailsPage.getApplicationId();

      await keysPage.navigate(appId);

      const keyCredentials = await keysPage.createKey(
        "Persistence Test",
        getFutureDate(30)
      );

      await authenticatedPage.goto(`/admin/application/${appId}/info`);
      await expect(
        authenticatedPage.getByRole("button", { name: "Edit" })
      ).toBeVisible();

      // Navigate back to Keys tab
      await keysPage.navigate(appId);

      // Verify key still exists
      const hasKey = await keysPage.hasKey(keyCredentials.id);
      expect(hasKey).toBe(true);
    });
  });
});
