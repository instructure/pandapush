/**
 * Authentication E2E Tests
 *
 * Test data cleanup:
 * - Global setup/teardown automatically cleans up test applications (test-app-*)
 */
const { expect } = require("@playwright/test");
const { test } = require("../fixtures/auth-fixtures");
const LoginPage = require("../page-objects/LoginPage");

test.describe("Authentication", () => {
  test("should login with basic auth and display username", async ({
    authenticatedPage,
  }) => {
    const loginPage = new LoginPage(authenticatedPage);
    await loginPage.navigateToAdmin();

    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBeTruthy();

    const username = await loginPage.getLoggedInUsername();
    expect(username).toBe("admin");

    expect(authenticatedPage.url()).toContain("/admin");
    const heading = authenticatedPage.getByRole("heading", {
      name: "Pandapush",
    });
    await expect(heading).toBeVisible();
  });

  test("should handle logout endpoint", async ({ authenticatedPage }) => {
    const loginPage = new LoginPage(authenticatedPage);
    await loginPage.navigateToAdmin();
    expect(await loginPage.isLoggedIn()).toBeTruthy();

    const response = await authenticatedPage.goto("/logout");

    // CURRENT BEHAVIOR: Returns 404 for basic auth
    // The basic auth logout handler calls next() without responding,
    // which falls through to Express's 404 handler.
    // TODO: Investigate if this is the desired behavior?
    expect(response.status()).toBe(404);

    // With HTTP Basic Auth, credentials persist in the browser context,
    // so there's no way to truly logout
    await loginPage.navigateToAdmin();
    expect(await loginPage.isLoggedIn()).toBeTruthy();
  });

  test("should require authentication to access admin area", async ({
    page,
  }) => {
    const response = await page.goto("/admin", {
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(401);

    const logoutButton = page.getByRole("link", { name: "Logout" });
    await expect(logoutButton).not.toBeVisible({ timeout: 3000 });
  });

  test("should reject invalid credentials", async ({ browser }) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: "admin",
        password: "wrongpassword",
      },
    });
    const page = await context.newPage();
    const response = await page.goto("/admin", {
      waitUntil: "domcontentloaded",
    });
    expect(response.status()).toBe(401);

    const logoutButton = page.getByRole("link", { name: "Logout" });
    await expect(logoutButton).not.toBeVisible({ timeout: 3000 });
    await context.close();
  });
});
