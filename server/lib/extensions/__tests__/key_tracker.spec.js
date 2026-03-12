/* eslint-env jest */

const createKeyTrackerExtension = require("../key_tracker");

describe("key_tracker extension", () => {
  let mockTracker;
  let extension;
  let callback;

  beforeEach(() => {
    mockTracker = { record: jest.fn() };
    extension = createKeyTrackerExtension(mockTracker);
    callback = jest.fn();
  });

  it("creates extension with incoming method", () => {
    expect(extension.incoming).toBeDefined();
    expect(typeof extension.incoming).toBe("function");
  });

  it("records key usage when __internal is present", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: {
        applicationId: "app123",
        keyId: "key456"
      }
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).toHaveBeenCalledWith("app123", "key456");
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("does not record when __internal is missing", () => {
    const message = {
      channel: "/app123/public/test"
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("does not crash when __internal is null", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: null
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("does not crash when __internal is undefined", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: undefined
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("handles missing applicationId in __internal", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: {
        keyId: "key456"
      }
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).toHaveBeenCalledWith(undefined, "key456");
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("handles missing keyId in __internal", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: {
        applicationId: "app123"
      }
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).toHaveBeenCalledWith("app123", undefined);
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("handles empty __internal object", () => {
    const message = {
      channel: "/app123/public/test",
      __internal: {}
    };

    extension.incoming(message, callback);

    expect(mockTracker.record).toHaveBeenCalledWith(undefined, undefined);
    expect(callback).toHaveBeenCalledWith(message);
  });

  it("always calls callback even without __internal", () => {
    const message = { channel: "/test" };

    extension.incoming(message, callback);

    expect(callback).toHaveBeenCalledWith(message);
  });

  it("records multiple messages sequentially", () => {
    const messages = [
      { __internal: { applicationId: "app1", keyId: "key1" } },
      { __internal: { applicationId: "app2", keyId: "key2" } },
      { __internal: { applicationId: "app3", keyId: "key3" } }
    ];

    messages.forEach(message => {
      extension.incoming(message, callback);
    });

    expect(mockTracker.record).toHaveBeenCalledTimes(3);
    expect(mockTracker.record).toHaveBeenNthCalledWith(1, "app1", "key1");
    expect(mockTracker.record).toHaveBeenNthCalledWith(2, "app2", "key2");
    expect(mockTracker.record).toHaveBeenNthCalledWith(3, "app3", "key3");
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("preserves message object in callback", () => {
    const message = {
      channel: "/app/public/test",
      data: { foo: "bar" },
      __internal: { applicationId: "app", keyId: "key" }
    };

    extension.incoming(message, callback);

    expect(callback).toHaveBeenCalledWith(message);
    expect(callback.mock.calls[0][0]).toBe(message); // Same object reference
  });

  it("works with different tracker implementations", () => {
    const trackers = [
      { record: jest.fn() },
      { record: jest.fn() },
      { record: jest.fn() }
    ];

    trackers.forEach(tracker => {
      const extension = createKeyTrackerExtension(tracker);
      const callback = jest.fn();

      extension.incoming(
        {
          __internal: { applicationId: "app", keyId: "key" }
        },
        callback
      );

      expect(tracker.record).toHaveBeenCalledWith("app", "key");
      expect(callback).toHaveBeenCalled();
    });
  });
});
