const BasePage = require("./BasePage");

/**
 * Page Object for Application Details page (/admin/application/:id)
 * Handles the Info tab with edit/delete functionality
 */
class ApplicationDetailsPage extends BasePage {
  async getApplicationId() {
    const row = this.page
      .locator("tr")
      .filter({ has: this.page.locator('th:has-text("ID")') });
    const cell = row.locator("td");
    return (await cell.textContent()).trim();
  }

  async getApplicationName() {
    const row = this.page
      .locator("tr")
      .filter({ has: this.page.locator('th:has-text("Name")') });
    const cell = row.locator("td");
    return (await cell.textContent()).trim();
  }

  async clickEdit() {
    await this.page.getByRole("button", { name: "Edit" }).click();
    // In edit mode Save button appears
    await this.page
      .getByRole("button", { name: "Save" })
      .waitFor({ state: "visible" });
  }

  async updateName(newName) {
    const nameRow = this.page
      .locator("tr")
      .filter({ has: this.page.locator('th:has-text("Name")') });
    const input = nameRow.getByRole("textbox");
    await input.fill(newName);
  }

  async clickSave() {
    await this.page.getByRole("button", { name: "Save" }).click();
    // After saving, Edit button reappears
    await this.page
      .getByRole("button", { name: "Edit" })
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async clickCancel() {
    await this.page.getByRole("button", { name: "Cancel" }).click();
    // After editing is finished, Edit button is visible
    await this.page
      .getByRole("button", { name: "Edit" })
      .waitFor({ state: "visible" });
  }

  async deleteApplication(confirm = true) {
    this.page.once("dialog", async dialog => {
      if (confirm) {
        const textToType = "confirm";
        await dialog.accept(textToType); // type "confirm" and click OK in Playwright
      } else {
        await dialog.dismiss();
      }
    });

    await this.page.getByRole("button", { name: "Delete" }).click();

    if (confirm) {
      await this.page.waitForURL(/\/admin\/?$/, { timeout: 10000 });
    }
  }

  async editApplicationName(newName) {
    await this.clickEdit();
    await this.updateName(newName);
    await this.clickSave();
  }

  async isInEditMode() {
    try {
      await this.page
        .getByRole("button", { name: "Save" })
        .waitFor({ state: "visible", timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ApplicationDetailsPage;
