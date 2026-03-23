const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

/**
 * Page Object for Console tab (/admin/application/:id/console)
 * Handles pub/sub testing functionality
 */
class ConsolePage extends BasePage {
  async navigate(applicationId) {
    await this.page.goto(`/admin/application/${applicationId}/console`, {
      waitUntil: "domcontentloaded"
    });
    const heading = this.page.getByRole("heading", { name: "Publish To" });
    await expect(heading).toBeVisible();
  }

  /**
   * Find a button and click it
   */
  async _clickButton(name, options = {}) {
    const button = this.page.getByRole("button", { name, ...options });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click();
  }

  /**
   * Select a channel for publishing or subscription
   */
  async _selectChannelType(testId, type) {
    const combobox = this.page.getByTestId(testId).getByRole("combobox");
    await combobox.click();
    await this.page.getByRole("option", { name: type }).click();
  }

  /**
   * Fill channel path and check if corresponding button is enabled/disabled
   */
  async _enterChannelPath(testId, path, buttonName, buttonOptions = {}) {
    await this.page
      .getByTestId(testId)
      .getByRole("textbox")
      .fill(path);

    const button = this.page.getByRole("button", {
      name: buttonName,
      ...buttonOptions
    });

    if (path) {
      await expect(button).toBeEnabled();
    } else {
      await expect(button).toBeDisabled();
    }
  }

  /**
   * Fill payload and check if it's filled properly
   */
  async _fillPayload(index, value, errorMessage) {
    // We have 2 CodeMirrors
    if (index > 0) {
      await expect(this.page.locator(".CodeMirror").nth(index)).toBeVisible();
    }

    // Use CodeMirror API directly via page.evaluate()
    const success = await this.page.evaluate(
      ({ idx, val }) => {
        const codeMirrorElements = document.querySelectorAll(".CodeMirror");
        if (
          codeMirrorElements.length > idx &&
          codeMirrorElements[idx]?.CodeMirror
        ) {
          codeMirrorElements[idx].CodeMirror.setValue(val);
          return codeMirrorElements[idx].CodeMirror.getValue() === val;
        }
        return false;
      },
      { idx: index, val: value }
    );

    if (!success) {
      throw new Error(errorMessage);
    }
  }

  async selectPublishChannelType(type) {
    await this._selectChannelType("publish-channel-type", type);
  }

  async enterPublishChannelPath(channelName) {
    // fill publish channel and check if Publish button is enabled
    await this._enterChannelPath(
      "publish-channel-path",
      channelName,
      "Publish (client)"
    );
  }

  async enterPublishPayload(jsonPayload) {
    await this._fillPayload(
      0,
      jsonPayload,
      "Failed to set CodeMirror value for publish payload"
    );
  }

  async clickPublishClient() {
    await this._clickButton("Publish (client)");
  }

  async clickPublishREST() {
    await this._clickButton("Publish (REST)");
  }

  async getPublishStatus() {
    // Success shows "Sent." text
    const successText = this.page.locator('text="Sent."');
    const isSuccess = await successText.isVisible().catch(() => false);

    if (isSuccess) {
      return { success: true, message: "Sent." };
    }

    // Error shows in spans with text-danger, text-warning, text-muted classes
    const errorSpan = this.page.locator(".text-danger").first();
    const isError = await errorSpan.isVisible().catch(() => false);

    if (isError) {
      const errorText = await errorSpan.textContent();
      return { success: false, message: errorText };
    }

    return null;
  }

  async waitForPublishSuccess() {
    await expect(this.page.getByText("Sent.")).toBeVisible();
  }

  async selectSubscribeChannelType(type) {
    await this._selectChannelType("subscribe-channel-type", type);
  }

  async enterSubscribeChannelPath(path) {
    await this._enterChannelPath("subscribe-channel-path", path, "Subscribe", {
      exact: true
    });
  }

  async enterPresenceId(presenceId) {
    // Presence ID field appears dynamically when presence channel type is selected
    // Wait for it to be visible before filling
    const presenceIdTextbox = this.page.getByRole("textbox", {
      name: "Presence ID"
    });
    await expect(presenceIdTextbox).toBeVisible();
    await presenceIdTextbox.fill(presenceId);
  }

  async enterPresenceData(jsonData) {
    await this._fillPayload(
      1,
      jsonData,
      "Failed to set CodeMirror value for presence data"
    );
  }

  async clickSubscribe() {
    await this._clickButton("Subscribe", { exact: true });
  }

  async clickUnsubscribe() {
    await this.page.getByRole("button", { name: "Unsubscribe" }).click();
  }

  async isSubscribed() {
    // When subscribed, spinner is visible and Unsubscribe button exists
    const unsubscribeButton = this.page.getByRole("button", {
      name: "Unsubscribe"
    });
    return await unsubscribeButton.isVisible().catch(() => false);
  }

  async waitForSubscription() {
    await expect(
      this.page.getByRole("button", { name: "Unsubscribe" })
    ).toBeVisible();
  }

  async hasEvents() {
    // Check if "Nothing yet." is NOT visible
    const nothingYet = this.page.locator('text="Nothing yet."');
    const isEmpty = await nothingYet.isVisible().catch(() => false);
    return !isEmpty;
  }

  async getEvents() {
    const hasEventsTable = await this.hasEvents();
    if (!hasEventsTable) {
      return [];
    }

    const table = this.page.locator("table").last();
    const rows = await table.locator("tbody tr").all();

    const events = [];
    for (const row of rows) {
      const cells = await row.locator("td").allTextContents();

      // Always has: Received, Payload columns (and possibly Channel)
      if (cells.length >= 2) {
        const hasChannelColumn = cells.length === 3;

        events.push({
          channel: hasChannelColumn ? cells[0].trim() : null,
          received: hasChannelColumn ? cells[1].trim() : cells[0].trim(),
          payload: hasChannelColumn ? cells[2].trim() : cells[1].trim()
        });
      }
    }

    return events;
  }

  async getEventCount() {
    // Event count is displayed as "N event(s)" above the table
    // Need to filter out the Subscribe button text "(for 50 events)"
    const eventCountElements = await this.page
      .locator("text=/\\d+ events?/")
      .all();

    for (const element of eventCountElements) {
      const text = await element.textContent();
      // Skip if it contains "for" (e.g., "for 50 events" from Subscribe button)
      if (text && !text.includes("for")) {
        const match = text.match(/(\d+)/);
        if (match) {
          return parseInt(match[1], 10);
        }
      }
    }
    return 0;
  }

  async waitForEventCount(expectedCount, timeout = 5000) {
    await expect
      .poll(async () => await this.getEventCount(), { timeout })
      .toBeGreaterThanOrEqual(expectedCount);
  }

  async isPublishButtonDisabled() {
    const button = this.page.getByRole("button", { name: "Publish (client)" });
    return await button.isDisabled();
  }

  async isSubscribeButtonDisabled() {
    const button = this.page.getByRole("button", {
      name: "Subscribe",
      exact: true
    });
    return await button.isDisabled();
  }

  /**
   * Complete publish flow: set channel, payload, and publish
   */
  async publishMessage(channelType, channelPath, payload, useClient = true) {
    await this.selectPublishChannelType(channelType);
    await this.enterPublishChannelPath(channelPath);
    await this.enterPublishPayload(payload);

    if (useClient) {
      await this.clickPublishClient();
    } else {
      await this.clickPublishREST();
    }

    await this.waitForPublishSuccess();
  }

  /**
   * Complete subscribe flow: set channel and subscribe
   */
  async subscribeToChannel(
    channelType,
    channelPath,
    presenceId = null,
    presenceData = null
  ) {
    await this.selectSubscribeChannelType(channelType);
    await this.enterSubscribeChannelPath(channelPath);

    if (channelType === "presence" && presenceId) {
      await this.enterPresenceId(presenceId);
      if (presenceData) {
        await this.enterPresenceData(presenceData);
      }
    }

    await this.clickSubscribe();
    await this.waitForSubscription();
  }
}

module.exports = ConsolePage;
