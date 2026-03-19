const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

/**
 * Page Object for Keys tab (/admin/application/:id/keys)
 * Handles key creation, viewing, and management
 */
class KeysPage extends BasePage {
  async navigate(applicationId) {
    await this.page.goto(`/admin/application/${applicationId}/keys`, {
      waitUntil: "domcontentloaded",
    });
    await this.page
      .getByRole("button", { name: "New Key" })
      .waitFor({ state: "visible", timeout: 10000 });
  }

  async clickNewKey() {
    await this.page.getByRole("button", { name: "New Key" }).click();
    // Wait for modal to appear
    await this.page
      .getByRole("heading", { name: "Create New Key" })
      .waitFor({ state: "visible" });
  }

  async fillKeyDetails(purpose, futureDate) {
    await this.page.getByLabel("Purpose").fill(purpose);

    // DateTimeInput has separate date and time fields
    const dateInput = this.page.getByLabel("Date");
    const timeInput = this.page.getByLabel("Time");

    await dateInput.fill(futureDate.date);
    await timeInput.fill(futureDate.time);
  }

  async submitKeyCreation() {
    const submitButton = this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Submit" });
    await submitButton.click();
  }

  async closeModal() {
    const closeButton = this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Close" })
      .first();
    await closeButton.click();

    // Wait for modal to disappear
    await expect(
      this.page.getByRole("heading", { name: "Create New Key" })
    ).not.toBeVisible();
  }

  /**
   * Create a new key and capture the alert with credentials
   * @param {string} purpose - The purpose of the key
   * @param {object} futureDate - Object with {date: 'MM/DD/YYYY', time: 'HH:MM AM/PM'}
   * @returns {Promise<{id: string, secret: string}>} The key credentials from the alert
   */
  async createKey(purpose, futureDate) {
    let keyCredentials = null;

    // Set up alert handler to capture key ID and secret
    this.page.once("dialog", async (dialog) => {
      const message = dialog.message();
      // Parse the alert message to extract ID and secret
      // Format: "Your new key ID is\n\n{id}\n\n and secret is\n\n{secret}\n\n..."
      const idMatch = message.match(/key ID is\s+([^\s]+)/);
      const secretMatch = message.match(/secret is\s+([^\s]+)/);

      if (idMatch && secretMatch) {
        keyCredentials = {
          id: idMatch[1],
          secret: secretMatch[1],
        };
      }

      await dialog.accept();
    });

    await this.clickNewKey();
    await this.fillKeyDetails(purpose, futureDate);
    await this.submitKeyCreation();

    // Wait for modal to close after successful creation
    await expect(
      this.page.getByRole("heading", { name: "Create New Key" })
    ).not.toBeVisible({ timeout: 10000 });

    return keyCredentials;
  }

  async getKeys() {
    const table = this.page.locator("table");
    await table.waitFor({ state: "visible" });

    const rows = await this.page.locator("tbody tr").all();
    const keys = [];

    for (const row of rows) {
      const cells = await row.locator("td").allTextContents();
      if (cells.length >= 7) {
        keys.push({
          id: cells[0].trim(),
          purpose: cells[1].trim(),
          created: cells[2].trim(),
          expires: cells[3].trim(),
          status: cells[4].trim(),
          lastUsed: cells[5].trim(),
          used: cells[6].trim(),
        });
      }
    }

    return keys;
  }

  async hasKey(keyId) {
    try {
      const cell = this.page.locator(`td.identifier:has-text("${keyId}")`);
      await cell.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getKeyByPurpose(purpose) {
    const keys = await this.getKeys();
    return keys.find((key) => key.purpose === purpose);
  }

  async isSubmitButtonDisabled() {
    const submitButton = this.page
      .getByRole("dialog")
      .getByRole("button", { name: "Submit" });
    return await submitButton.isDisabled();
  }

  async getTableRowCount() {
    const rows = await this.page.locator("tbody tr").all();
    return rows.length;
  }
}

module.exports = KeysPage;
