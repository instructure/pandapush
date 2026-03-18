const BasePage = require("./BasePage");

/**
 * Page Object for Applications List page (/admin)
 */
class ApplicationsListPage extends BasePage {
  async navigate() {
    await this.page.goto("/admin", { waitUntil: "domcontentloaded" });
    await this.page.getByRole("heading", { name: "Pandapush" }).waitFor({
      state: "visible",
      timeout: 15000
    });
  }

  async clickNewApplication() {
    await this.page.getByRole("button", { name: "New Application" }).click();
    // Wait for modal to appear
    await this.page
      .getByRole("heading", { name: "Create New Application" })
      .waitFor({ state: "visible" });
  }

  async createApplication(name) {
    await this.clickNewApplication();
    await this.page.getByLabel("Name").fill(name);
    await this.page.getByRole("button", { name: "Submit" }).click();
    // Wait for modal to close and redirect to info tab
    await this.page.waitForURL(/\/admin\/application\/[^/]+\/info/, {
      timeout: 10000
    });
  }

  async getApplications() {
    const rows = await this.page.locator("tbody tr").all();
    const applications = [];

    for (const row of rows) {
      const cells = await row.locator("td, th").allTextContents();
      applications.push({
        id: cells[0].trim(),
        name: cells[1].trim(),
        createdAt: cells[2].trim(),
        createdBy: cells[3].trim()
      });
    }

    return applications;
  }

  async hasApplication(applicationId) {
    try {
      await this.page
        .getByRole("link", { name: applicationId })
        .waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickApplication(applicationId) {
    await this.page.getByRole("link", { name: applicationId }).click();
    await this.page.waitForURL(/\/admin\/application\/[^/]+\/info/, {
      timeout: 10000
    });
  }
}

module.exports = ApplicationsListPage;
