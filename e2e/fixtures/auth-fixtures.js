const { test: base } = require("@playwright/test");
const ApplicationsListPage = require("../page-objects/ApplicationsListPage");
const ApplicationDetailsPage = require("../page-objects/ApplicationDetailsPage");
const ConsolePage = require("../page-objects/ConsolePage");

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
  },

  /**
   * Page objects initialized with authenticated page
   */
  pageObjects: async ({ authenticatedPage }, use) => {
    await use({
      applicationsPage: new ApplicationsListPage(authenticatedPage),
      detailsPage: new ApplicationDetailsPage(authenticatedPage),
      consolePage: new ConsolePage(authenticatedPage)
    });
  },

  /**
   * Fresh application created for the test with console page ready
   */
  consoleSetup: async ({ pageObjects }, use) => {
    const { applicationsPage, detailsPage, consolePage } = pageObjects;
    const appName = `test-app-${Date.now()}`;

    await applicationsPage.navigate();
    await applicationsPage.createApplication(appName);
    const appId = await detailsPage.getApplicationId();
    await consolePage.navigate(appId);

    await use({ appId, appName, ...pageObjects });
  }
});

module.exports = { test };
