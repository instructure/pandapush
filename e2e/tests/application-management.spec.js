/**
 * Application Management E2E Tests
 *
 * Tests for creating, editing, and deleting applications through the admin UI.
 *
 * Test data cleanup:
 * - Global setup/teardown automatically cleans up test applications (test-app-*)
 */
const { expect } = require("@playwright/test");
const { test } = require("../fixtures/auth-fixtures");
const ApplicationsListPage = require("../page-objects/ApplicationsListPage");
const ApplicationDetailsPage = require("../page-objects/ApplicationDetailsPage");

test.describe("Application Management", () => {
  test.describe("Create Application Flow", () => {
    test("should create a new application and verify it appears in the list", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const appName = `test-app-create-${Date.now()}`;

      await applicationsPage.navigate();

      await applicationsPage.createApplication(appName);

      // Should redirect to application details page (with /info suffix)
      expect(authenticatedPage.url()).toMatch(
        /\/admin\/application\/[^/]+\/info/
      );

      // Verify application details page loaded
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const displayedName = await detailsPage.getApplicationName();
      expect(displayedName).toBe(appName);

      await applicationsPage.navigate();

      // Verify application appears in the list
      const applications = await applicationsPage.getApplications();
      const createdApp = applications.find(app => app.name === appName);

      expect(createdApp).toBeDefined();
      expect(createdApp.name).toBe(appName);
      expect(createdApp.createdBy).toBe("admin");
    });

    test("should not submit form with empty application name", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);

      await applicationsPage.navigate();
      await applicationsPage.clickNewApplication();

      // Submit button should be disabled when name is empty
      const submitButton = authenticatedPage.getByRole("button", {
        name: "Submit"
      });
      await expect(submitButton).toBeDisabled();
    });

    test("should be able to close new application modal without creating", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);

      await applicationsPage.navigate();
      await applicationsPage.clickNewApplication();

      // Modal should be visible
      await expect(
        authenticatedPage.getByRole("heading", {
          name: "Create New Application"
        })
      ).toBeVisible();

      await authenticatedPage
        .getByRole("button", { name: "Close" })
        .first()
        .click();

      // Modal should disappear
      await expect(
        authenticatedPage.getByRole("heading", {
          name: "Create New Application"
        })
      ).not.toBeVisible();

      expect(authenticatedPage.url()).toContain("/admin");
    });
  });

  test.describe("Delete Application Flow", () => {
    test("should delete application after confirmation", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const appName = `test-app-delete-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName); // after app creation we are redirected to detailspage

      const appId = await detailsPage.getApplicationId();
      await detailsPage.deleteApplication(true);
      expect(authenticatedPage.url()).toMatch(/\/admin\/?$/);

      // Verify application is no longer in the list
      const hasApplication = await applicationsPage.hasApplication(appId);
      expect(hasApplication).toBe(false);
    });

    test("should cancel deletion when confirmation is not provided", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const appName = `test-app-delete-cancel-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName); // after app creation we are redirected to detailspage

      const appId = await detailsPage.getApplicationId();

      // Try to delete but cancel
      await detailsPage.deleteApplication(false);

      // Should still be on the application details page
      expect(authenticatedPage.url()).toContain(
        `/admin/application/${appId}/info`
      );

      // Application still exists
      const displayedName = await detailsPage.getApplicationName();
      expect(displayedName).toBe(appName);

      await applicationsPage.navigate();
      const hasApplication = await applicationsPage.hasApplication(appId);
      expect(hasApplication).toBe(true);
    });
  });

  test.describe("Edit Application", () => {
    test("should update application name and persist changes", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const originalName = `test-app-edit-${Date.now()}`;
      const updatedName = `${originalName}-updated`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(originalName);

      const appId = await detailsPage.getApplicationId();
      await detailsPage.editApplicationName(updatedName);

      const displayedName = await detailsPage.getApplicationName();
      expect(displayedName).toBe(updatedName);

      // Navigate to applications list and verify the change persisted
      await applicationsPage.navigate();
      await applicationsPage.clickApplication(appId);

      // Verify the updated name is still displayed
      const persistedName = await detailsPage.getApplicationName();
      expect(persistedName).toBe(updatedName);
    });

    test("should cancel editing and discard changes", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const originalName = `test-app-cancel-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(originalName);

      await detailsPage.clickEdit();

      // Verify we're in edit mode
      const isEditing = await detailsPage.isInEditMode();
      expect(isEditing).toBe(true);

      await detailsPage.updateName("this-should-not-persist");
      await detailsPage.clickCancel();

      const stillEditing = await detailsPage.isInEditMode();
      expect(stillEditing).toBe(false);

      const displayedName = await detailsPage.getApplicationName();
      expect(displayedName).toBe(originalName);
    });

    test("should disable delete button in edit mode", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const appName = `test-app-delete-disabled-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);

      await detailsPage.clickEdit();

      const deleteButton = authenticatedPage.getByRole("button", {
        name: "Delete"
      });
      await expect(deleteButton).toBeDisabled();

      await detailsPage.clickCancel();
      await expect(deleteButton).toBeEnabled();
    });

    test("should show Edit and Delete buttons when not in edit mode", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const appName = `test-app-buttons-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);

      await expect(
        authenticatedPage.getByRole("button", { name: "Edit" })
      ).toBeVisible();
      await expect(
        authenticatedPage.getByRole("button", { name: "Delete" })
      ).toBeVisible();
    });

    test("should show Save and Cancel buttons when in edit mode", async ({
      authenticatedPage
    }) => {
      const applicationsPage = new ApplicationsListPage(authenticatedPage);
      const detailsPage = new ApplicationDetailsPage(authenticatedPage);
      const appName = `test-app-edit-buttons-${Date.now()}`;

      await applicationsPage.navigate();
      await applicationsPage.createApplication(appName);

      await detailsPage.clickEdit();

      // Verify edit mode buttons are visible
      await expect(
        authenticatedPage.getByRole("button", { name: "Save" })
      ).toBeVisible();
      await expect(
        authenticatedPage.getByRole("button", { name: "Cancel" })
      ).toBeVisible();

      const editButtons = await authenticatedPage
        .getByRole("button", { name: "Edit", exact: true })
        .count();
      expect(editButtons).toBe(0);
    });
  });
});
