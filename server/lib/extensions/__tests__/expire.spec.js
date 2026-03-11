/* eslint-env jest */

// Mock redis module before requiring expire
jest.mock("redis", () => {
  const mockClient = {
    expire: jest.fn().mockResolvedValue(true),
    quit: jest.fn().mockResolvedValue(true)
  };
  return {
    createClient: jest.fn(() => mockClient)
  };
});

const redis = require("redis");
const createExpireExtension = require("../expire");

describe("expire extension", () => {
  const redisConfigs = [
    { host: "redis1", port: 6379 },
    { host: "redis2", port: 6379 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("with standard redis configs", () => {
    let extension;
    let callback;

    beforeEach(async () => {
      extension = await createExpireExtension(redisConfigs);
      callback = jest.fn();
    });

    test("creates extension with incoming method", () => {
      expect(extension.incoming).toBeDefined();
      expect(typeof extension.incoming).toBe("function");
    });

    test("sets expiry on presence channels", async () => {
      const message = {
        channel: "/app123/presence/room"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).toHaveBeenCalledTimes(2);
      expect(redis.createClient).toHaveBeenCalledWith(6379, "redis1");
      expect(redis.createClient).toHaveBeenCalledWith(6379, "redis2");

      const mockClient = redis.createClient();
      expect(mockClient.expire).toHaveBeenCalledWith(
        "/app123/presence/room",
        60 * 60 * 24 * 31 * 6 // 6 months in seconds
      );

      // Wait for async operations in forEach to complete
      await new Promise(resolve => setImmediate(resolve));

      expect(mockClient.quit).toHaveBeenCalled();

      expect(callback).toHaveBeenCalledWith(message);
    });

    test("does not set expiry on public channels", async () => {
      const message = {
        channel: "/app123/public/chat"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(message);
    });

    test("does not set expiry on private channels", async () => {
      const message = {
        channel: "/app123/private/secure"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(message);
    });

    test("does not set expiry on meta channels", async () => {
      const message = {
        channel: "/meta/subscribe"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(message);
    });

    test("regex matches valid presence channels", async () => {
      const validChannels = [
        "/app/presence/room",
        "/myapp123/presence/lobby",
        "/test_app/presence/channel-name",
        "/APP/presence/test"
      ];

      for (const channel of validChannels) {
        jest.clearAllMocks();
        await extension.incoming({ channel }, callback);

        // Each channel should trigger 2 Redis clients (2 configs)
        expect(redis.createClient).toHaveBeenCalledTimes(2);
      }
    });

    test("regex rejects invalid presence-like channels", async () => {
      const invalidChannels = [
        "/presence/room", // Missing app ID
        "app/presence/room", // Missing leading slash
        "/app/presencex/room", // 'presencex' not 'presence'
        "//app/presence/room", // Double slash
        "/app/PRESENCE/room" // Uppercase (regex is case-sensitive)
      ];

      for (const channel of invalidChannels) {
        jest.clearAllMocks();
        await extension.incoming({ channel }, callback);

        expect(redis.createClient).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledWith({ channel });
      }
    });

    test("always calls callback regardless of channel type", async () => {
      const channels = [
        "/app/presence/room",
        "/app/public/test",
        "/app/private/secure",
        "/meta/subscribe"
      ];

      for (const channel of channels) {
        jest.clearAllMocks();
        await extension.incoming({ channel }, callback);
        expect(callback).toHaveBeenCalledWith({ channel });
      }
    });
  });

  describe("with custom redis configs", () => {
    test("works with multiple Redis configs", async () => {
      const configs = [
        { host: "redis1", port: 6379 },
        { host: "redis2", port: 6380 },
        { host: "redis3", port: 6381 }
      ];

      const extension = await createExpireExtension(configs);
      const callback = jest.fn();

      const message = {
        channel: "/app/presence/test"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).toHaveBeenCalledTimes(3);
      expect(redis.createClient).toHaveBeenCalledWith(6379, "redis1");
      expect(redis.createClient).toHaveBeenCalledWith(6380, "redis2");
      expect(redis.createClient).toHaveBeenCalledWith(6381, "redis3");
    });

    test("works with single Redis config", async () => {
      const configs = [{ host: "redis1", port: 6379 }];

      const extension = await createExpireExtension(configs);
      const callback = jest.fn();

      const message = {
        channel: "/app/presence/test"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).toHaveBeenCalledTimes(1);
      expect(redis.createClient).toHaveBeenCalledWith(6379, "redis1");
    });

    test("handles empty redis configs", async () => {
      const extension = await createExpireExtension([]);
      const callback = jest.fn();

      const message = {
        channel: "/app/presence/test"
      };

      await extension.incoming(message, callback);

      expect(redis.createClient).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith(message);
    });
  });
});
