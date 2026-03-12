/**
 * Common helper methods for page objects.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Wait for navigation to complete
   * Defaults to 'domcontentloaded' instead of 'networkidle' because
   * networkidle is unreliable for apps with WebSockets/polling
   */
  async waitForNavigation(options = {}) {
    const waitUntil = options.waitUntil || "domcontentloaded";
    await this.page.waitForLoadState(waitUntil);
  }
}

module.exports = BasePage;
