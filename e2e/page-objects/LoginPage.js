const BasePage = require("./BasePage");

class LoginPage extends BasePage {
  /**
   * Navigate to admin page (assumes auth is already set at context level)
   */
  async navigateToAdmin() {
    await this.page.goto("/admin", { waitUntil: "domcontentloaded" });
    await this.page.getByRole("heading", { name: "Pandapush" }).waitFor({
      state: "visible",
      timeout: 15000,
    });
  }

  async isLoggedIn() {
    try {
      await this.page.getByRole("link", { name: "Logout" }).waitFor({
        state: "visible",
        timeout: 5000,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getLoggedInUsername() {
    // The username is in a <b> tag after "Logged in as" text
    const userInfoSection = await this.page
      .getByText(/Logged in as/)
      .textContent();
    const match = userInfoSection.match(/Logged in as\s+(.+)/);
    return match ? match[1].trim() : null;
  }

  async logout() {
    await this.page.getByRole("link", { name: "Logout" }).click();
    await this.page.waitForLoadState("domcontentloaded");
    // Give the server a moment to process the logout
    await this.page.waitForTimeout(500);
  }
}

module.exports = LoginPage;
