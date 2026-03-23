/**
 * Console Publish/Subscribe E2E Tests
 *
 * Tests for pub/sub functionality through the Console tab.
 *
 * Test data cleanup:
 * - Global setup/teardown automatically cleans up test applications (test-app-*)
 */
const { expect } = require("@playwright/test");
const { test } = require("../fixtures/auth-fixtures");

test.describe("Console Publish/Subscribe", () => {
  test.describe("Publish Flow", () => {
    test("should publish message to public channel using client", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      // Publish via client
      await consolePage.selectPublishChannelType("public");
      await consolePage.enterPublishChannelPath("test");
      await consolePage.enterPublishPayload('{"message": "test"}');
      await consolePage.clickPublishClient();

      await consolePage.waitForPublishSuccess();
      const status = await consolePage.getPublishStatus();
      expect(status.success).toBe(true);
      expect(status.message).toBe("Sent.");
    });

    test("should publish message to public channel using REST", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      // Publish via REST
      await consolePage.selectPublishChannelType("public");
      await consolePage.enterPublishChannelPath("test-rest");
      await consolePage.enterPublishPayload('{"method": "REST"}');
      await consolePage.clickPublishREST();

      await consolePage.waitForPublishSuccess();
      const status = await consolePage.getPublishStatus();
      expect(status.success).toBe(true);
    });

    test("should validate JSON payload format", async ({
      consoleSetup,
      authenticatedPage
    }) => {
      const { consolePage } = consoleSetup;

      // Try to publish invalid JSON
      await consolePage.selectPublishChannelType("public");
      await consolePage.enterPublishChannelPath("test");
      await consolePage.enterPublishPayload("invalid json {");

      const dialogPromise = new Promise(resolve => {
        authenticatedPage.once("dialog", async dialog => {
          const message = dialog.message();
          await dialog.accept();
          resolve(message);
        });
      });

      await consolePage.clickPublishClient();

      const message = await dialogPromise;
      expect(message).toContain("Payload must be valid JSON");
    });

    test("should disable publish buttons when channel path is empty", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      // Select channel type but don't enter path
      await consolePage.selectPublishChannelType("public");
      await consolePage.enterPublishChannelPath("");

      const isDisabled = await consolePage.isPublishButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    test("should handle empty payload as empty object", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.selectPublishChannelType("public");
      await consolePage.enterPublishChannelPath("test-empty");
      await consolePage.enterPublishPayload("");
      await consolePage.clickPublishClient();

      // Should succeed (empty becomes {})
      await consolePage.waitForPublishSuccess();
      const status = await consolePage.getPublishStatus();
      expect(status.success).toBe(true);
    });
  });

  test.describe("Subscribe Flow", () => {
    test("should subscribe to public channel", async ({ consoleSetup }) => {
      const { consolePage } = consoleSetup;

      await consolePage.selectSubscribeChannelType("public");
      await consolePage.enterSubscribeChannelPath("test-channel");
      await consolePage.clickSubscribe();

      // Verify subscription
      await consolePage.waitForSubscription();
      const isSubscribed = await consolePage.isSubscribed();
      expect(isSubscribed).toBe(true);
    });

    test("should unsubscribe from channel", async ({ consoleSetup }) => {
      const { consolePage } = consoleSetup;

      await consolePage.subscribeToChannel("public", "test-unsub");
      expect(await consolePage.isSubscribed()).toBe(true);

      await consolePage.clickUnsubscribe();

      const isSubscribed = await consolePage.isSubscribed();
      expect(isSubscribed).toBe(false);
    });

    test("should disable subscribe button when channel path is empty", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      // Select channel type but don't enter path
      await consolePage.selectSubscribeChannelType("public");
      await consolePage.enterSubscribeChannelPath("");

      const isDisabled = await consolePage.isSubscribeButtonDisabled();
      expect(isDisabled).toBe(true);
    });

    test("should show empty events state initially", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.subscribeToChannel("public", "empty-test");

      // Initially should show "Nothing yet."
      const hasEvents = await consolePage.hasEvents();
      expect(hasEvents).toBe(false);

      const eventCount = await consolePage.getEventCount();
      expect(eventCount).toBe(0);
    });
  });

  test.describe("Publish and Subscribe Integration", () => {
    test("should receive published message on subscribed channel", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.subscribeToChannel("public", "integration-test");

      await consolePage.publishMessage(
        "public",
        "integration-test",
        '{"data": "test message"}'
      );

      await consolePage.waitForEventCount(1, 5000);

      const events = await consolePage.getEvents();
      expect(events.length).toBeGreaterThanOrEqual(1);

      const firstEvent = events[0];
      expect(firstEvent.payload).toContain("test message");
    });

    test("should handle multiple messages on same channel", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.subscribeToChannel("public", "multi-test");

      await consolePage.publishMessage("public", "multi-test", '{"count": 1}');
      await consolePage.publishMessage("public", "multi-test", '{"count": 2}');
      await consolePage.publishMessage("public", "multi-test", '{"count": 3}');

      await consolePage.waitForEventCount(3, 5000);

      const eventCount = await consolePage.getEventCount();
      expect(eventCount).toBeGreaterThanOrEqual(3);
    });

    test("should not receive messages after unsubscribing", async ({
      consoleSetup,
      authenticatedPage
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.subscribeToChannel("public", "unsub-test");
      await consolePage.publishMessage(
        "public",
        "unsub-test",
        '{"before": "unsubscribe"}'
      );

      await consolePage.waitForEventCount(1, 5000);

      const eventsBefore = await consolePage.getEvents();
      expect(eventsBefore.length).toBe(1);
      expect(eventsBefore[0].payload).toContain("before");

      await consolePage.clickUnsubscribe();

      await expect(
        authenticatedPage.getByRole("button", {
          name: "Subscribe",
          exact: true
        })
      ).toBeVisible({ timeout: 2000 });

      // Publish another message (shouldn't be received)
      await consolePage.publishMessage(
        "public",
        "unsub-test",
        '{"after": "unsubscribe"}'
      );

      // Give time for message to potentially arrive (it shouldn't)
      await authenticatedPage.waitForTimeout(1000);

      // Verify event count hasn't increased and "after" message wasn't received
      const eventsAfter = await consolePage.getEvents();
      expect(eventsAfter.length).toBe(1);

      const afterUnsubscribeEvent = eventsAfter.find(e =>
        e.payload.includes("after")
      );
      expect(afterUnsubscribeEvent).toBeUndefined();
    });
  });

  test.describe("Channel Types", () => {
    test("should support private channel", async ({ consoleSetup }) => {
      const { consolePage } = consoleSetup;

      await consolePage.selectSubscribeChannelType("private");
      await consolePage.enterSubscribeChannelPath("secure-channel");
      await consolePage.clickSubscribe();

      await consolePage.waitForSubscription();

      const isSubscribed = await consolePage.isSubscribed();
      expect(isSubscribed).toBe(true);
    });

    test("should support presence channel", async ({
      consoleSetup,
      authenticatedPage
    }) => {
      const { consolePage } = consoleSetup;

      await consolePage.selectSubscribeChannelType("presence");

      // Pressence id field gets rendered after we select presence
      await expect(
        authenticatedPage.getByRole("textbox", { name: "Presence ID" })
      ).toBeAttached({ timeout: 5000 });

      await consolePage.enterSubscribeChannelPath("room-123");
      await consolePage.enterPresenceId("user-test");
      await consolePage.enterPresenceData('{"status": "online"}');
      await consolePage.clickSubscribe();

      await consolePage.waitForSubscription();

      const isSubscribed = await consolePage.isSubscribed();
      expect(isSubscribed).toBe(true);

      await expect(
        authenticatedPage.getByRole("heading", { name: "Subscribers" })
      ).toBeVisible();
    });

    test("should support meta channel", async ({ consoleSetup }) => {
      const { consolePage } = consoleSetup;

      await consolePage.selectSubscribeChannelType("meta");
      await consolePage.enterSubscribeChannelPath("statistics");
      await consolePage.clickSubscribe();

      await consolePage.waitForSubscription();

      const isSubscribed = await consolePage.isSubscribed();
      expect(isSubscribed).toBe(true);
    });
  });

  test.describe("Edge Cases", () => {
    test("should handle complex JSON payload", async ({ consoleSetup }) => {
      const { consolePage } = consoleSetup;

      const complexPayload = JSON.stringify({
        nested: {
          object: {
            with: ["arrays", 123, true, null]
          }
        },
        unicode: "Hello 世界 🌍"
      });

      await consolePage.subscribeToChannel("public", "complex");
      await consolePage.publishMessage("public", "complex", complexPayload);

      await consolePage.waitForEventCount(1, 5000);

      const events = await consolePage.getEvents();
      expect(events[0].payload).toContain("Hello 世界 🌍");
    });

    test("should handle channel path with special characters", async ({
      consoleSetup
    }) => {
      const { consolePage } = consoleSetup;

      const channelPath = "test-channel_123";
      await consolePage.subscribeToChannel("public", channelPath);
      await consolePage.publishMessage("public", channelPath, '{"test": true}');

      await consolePage.waitForEventCount(1, 5000);
    });
  });
});
