const { test: base } = require("@playwright/test");

/**
 * Custom fixture that provides a browser context with HTTP Basic Auth credentials
 */
const test = base.extend({
  /**
   * Authenticated context with HTTP Basic Auth credentials
   */
  authenticatedContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: "admin",
        password: "testpassword123"
      }
    });
    await use(context);
    await context.close();
  },

  /**
   * Authenticated page from authenticated context
   */
  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
    await page.close();
  }
});

module.exports = { test };
