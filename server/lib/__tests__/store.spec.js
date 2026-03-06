/* eslint-env jest */

// Create mock knex before store module loads
const mockWhere = jest.fn().mockReturnThis();
const mockWhereExists = jest.fn().mockReturnThis();
const mockWhereRaw = jest.fn().mockReturnThis();
const mockFrom = jest.fn().mockReturnThis();
const mockSelect = jest.fn().mockReturnThis();
const mockFirst = jest.fn().mockResolvedValue(null);
const mockInsert = jest.fn().mockResolvedValue([1]);
const mockUpdate = jest.fn().mockResolvedValue(1);
const mockDel = jest.fn().mockResolvedValue(1);
const mockThen = jest.fn(cb =>
  Promise.resolve([{ id: "key1", application_id: "app1" }])
);

const mockTransaction = jest.fn(cb => {
  const tx = jest.fn(table => ({
    where: mockWhere,
    del: mockDel,
    insert: mockInsert
  }));
  return cb(tx);
});

const mockKnexInstance = jest.fn(table => ({
  where: mockWhere,
  whereExists: mockWhereExists,
  select: mockSelect,
  first: mockFirst,
  insert: mockInsert,
  update: mockUpdate,
  del: mockDel,
  then: mockThen,
  whereRaw: mockWhereRaw,
  from: mockFrom
}));

mockKnexInstance.transaction = mockTransaction;
mockKnexInstance.raw = jest.fn(sql => sql);
mockKnexInstance.migrate = {
  latest: jest.fn().mockResolvedValue([])
};

// Mock the knex module to return our mock instance
jest.mock("knex", () => {
  return jest.fn(() => mockKnexInstance);
});

// Mock token module
jest.mock("../token", () => ({
  generate: jest.fn()
}));

// Mock memory-cache
jest.mock("memory-cache", () => ({
  get: jest.fn(),
  put: jest.fn()
}));

// Mock moment
jest.mock("moment", () => {
  const momentMock = jest.fn(() => ({
    toISOString: jest.fn(() => "2024-01-01T00:00:00.000Z"),
    add: jest.fn().mockReturnThis()
  }));
  return momentMock;
});

// Now require the modules
const cache = require("memory-cache");
const moment = require("moment");
const token = require("../token");
const store = require("../store");

describe("store", () => {
  let mockClient;
  let mockSubscription;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockWhere.mockReturnThis();
    mockWhereExists.mockReturnThis();
    mockSelect.mockReturnThis();
    mockInsert.mockResolvedValue([1]);
    mockUpdate.mockResolvedValue(1);
    mockDel.mockResolvedValue(1);
    mockFirst.mockResolvedValue(null);
    mockThen.mockImplementation(cb =>
      Promise.resolve([{ id: "key1", application_id: "app1" }])
    );

    // Setup mock Faye client
    mockSubscription = { cancel: jest.fn() };
    mockClient = {
      subscribe: jest.fn(() => mockSubscription),
      publish: jest.fn()
    };

    // Setup mock token
    token.generate.mockReset();
    token.generate
      .mockResolvedValueOnce("mockedid123456789012")
      .mockResolvedValueOnce("mockedsecret");

    // Setup mock cache
    cache.get.mockReturnValue(undefined);
    cache.put.mockReturnValue(true);

    // Setup mock moment
    moment.mockReturnValue({
      toISOString: jest.fn(() => "2024-01-01T00:00:00.000Z"),
      add: jest.fn().mockReturnThis()
    });
  });

  describe("Cache Management", () => {
    it("getKeyCachedSync returns cached key", () => {
      const mockKey = { id: "key1", application_id: "app1", secret: "secret1" };
      cache.get.mockReturnValue(mockKey);

      const result = store.getKeyCachedSync("app1", "key1");

      expect(cache.get).toHaveBeenCalledWith("key:app1:key1");
      expect(result).toEqual(mockKey);
    });

    it("getKeyCachedSync returns undefined for non-existent key", () => {
      cache.get.mockReturnValue(undefined);

      const result = store.getKeyCachedSync("app1", "nonexistent");

      expect(cache.get).toHaveBeenCalledWith("key:app1:nonexistent");
      expect(result).toBeUndefined();
    });

    it("getKeyCachedSync uses correct cache namespace format", () => {
      store.getKeyCachedSync("myapp", "mykey");

      expect(cache.get).toHaveBeenCalledWith("key:myapp:mykey");
    });
  });

  describe("Initialization & Lifecycle", () => {
    it("init sets up Faye subscription", () => {
      store.init(mockClient);

      expect(mockClient.subscribe).toHaveBeenCalledWith(
        "/internal/meta/config",
        expect.any(Function)
      );
    });

    it("init starts polling interval", () => {
      jest.useFakeTimers();
      store.init(mockClient);

      expect(setInterval).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it("stop clears interval and cancels subscription", () => {
      jest.useFakeTimers();
      store.init(mockClient);
      store.stop();

      expect(clearInterval).toHaveBeenCalled();
      expect(mockSubscription.cancel).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe("Application Management", () => {
    it("getApplications returns all applications", async () => {
      store.getApplications();

      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
    });

    it("getApplicationsForUser returns query for user's apps", () => {
      store.getApplicationsForUser("testuser");

      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
    });

    it("getApplicationForUserById returns specific app for user", async () => {
      store.getApplicationForUserById("testuser", "app1");

      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
      expect(mockWhere).toHaveBeenCalledWith("id", "app1");
    });

    it("addApplication creates app with generated ID", async () => {
      token.generate.mockResolvedValue("generatedid12345678");

      await store.addApplication("Test App", "testuser");

      expect(token.generate).toHaveBeenCalledWith(20);
      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
    });

    it("addApplication adds user as admin", async () => {
      token.generate.mockResolvedValue("generatedid12345678");

      await store.addApplication("Test App", "testuser");

      expect(mockKnexInstance).toHaveBeenCalledWith("application_users");
      expect(mockInsert).toHaveBeenCalled();
    });

    it("removeApplication deletes app, keys, and users in transaction", async () => {
      await store.removeApplication("app1");

      expect(mockTransaction).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalledWith("application_id", "app1");
      expect(mockWhere).toHaveBeenCalledWith("id", "app1");
      expect(mockDel).toHaveBeenCalled();
      expect(mockDel.mock.calls.length).toBeGreaterThanOrEqual(3); // app_users, keys, applications
    });

    it("removeApplication publishes cache invalidation notification", async () => {
      store.init(mockClient);
      await store.removeApplication("app1");

      expect(mockClient.publish).toHaveBeenCalledWith(
        "/internal/meta/config",
        {}
      );
    });
  });

  describe("Key Management", () => {
    beforeEach(() => {
      token.generate.mockReset();
      token.generate
        .mockResolvedValueOnce("1234567890123456")
        .mockResolvedValueOnce("mockedsecret256bytes");
    });

    it("getApplicationKeys returns all keys for app", () => {
      store.getApplicationKeys("app1");

      expect(mockKnexInstance).toHaveBeenCalledWith("keys");
      expect(mockWhere).toHaveBeenCalledWith("application_id", "app1");
    });

    it("getApplicationKey returns specific key", () => {
      store.getApplicationKey("app1", "key1");

      expect(mockKnexInstance).toHaveBeenCalledWith("keys");
      expect(mockWhere).toHaveBeenCalledWith("application_id", "app1");
      expect(mockWhere).toHaveBeenCalledWith("id", "key1");
    });

    it("addKey generates random ID with PSID prefix", async () => {
      store.init(mockClient);
      await store.addKey("app1", "2025-01-01T00:00:00Z", "test", "testuser");

      expect(token.generate).toHaveBeenNthCalledWith(1, 16);
    });

    it("addKey generates random secret", async () => {
      store.init(mockClient);
      await store.addKey("app1", "2025-01-01T00:00:00Z", "test", "testuser");

      expect(token.generate).toHaveBeenNthCalledWith(2, 256);
    });

    it("addKey sets created_at timestamp", async () => {
      store.init(mockClient);
      const result = await store.addKey(
        "app1",
        "2025-01-01T00:00:00Z",
        "test",
        "testuser"
      );

      expect(result.created_at).toBe("2024-01-01T00:00:00.000Z");
    });

    it("addKey publishes cache invalidation notification", async () => {
      store.init(mockClient);
      await store.addKey("app1", "2025-01-01T00:00:00Z", "test", "testuser");

      expect(mockClient.publish).toHaveBeenCalledWith(
        "/internal/meta/config",
        {}
      );
    });

    it("addKey returns created key attributes", async () => {
      store.init(mockClient);
      const result = await store.addKey(
        "app1",
        "2025-01-01T00:00:00Z",
        "test purpose",
        "testuser"
      );

      expect(result).toEqual({
        id: "PSID1234567890123456",
        secret: "mockedsecret256bytes",
        application_id: "app1",
        expires: "2025-01-01T00:00:00Z",
        purpose: "test purpose",
        created_by: "testuser",
        created_at: "2024-01-01T00:00:00.000Z"
      });
    });

    it("addKeyUsage increments use_count", async () => {
      await store.addKeyUsage("app1", "key1", new Date(), 5);

      expect(mockKnexInstance).toHaveBeenCalledWith("keys");
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("addKeyUsage updates last_used timestamp", async () => {
      moment.mockReturnValue({
        toISOString: jest.fn(() => "2024-01-02T12:00:00.000Z")
      });

      await store.addKeyUsage("app1", "key1", new Date(), 1);

      expect(moment).toHaveBeenCalled();
    });

    it("addKeyUsage uses coalesce for null use_count", async () => {
      await store.addKeyUsage("app1", "key1", new Date(), 3);

      expect(mockKnexInstance.raw).toHaveBeenCalledWith(
        "coalesce(use_count, 0) + ?",
        [3]
      );
    });
  });

  describe("Admin Management", () => {
    it("getApplicationUsers returns array of user_id strings", async () => {
      const mockRows = [{ user_id: "user1" }, { user_id: "user2" }];
      // mockThen needs to execute the callback that maps the rows
      mockThen.mockImplementation(cb => Promise.resolve(cb(mockRows)));

      const result = await store.getApplicationUsers("app1");

      expect(mockKnexInstance).toHaveBeenCalledWith("application_users");
      expect(result).toEqual(["user1", "user2"]);
    });

    it("updateApplication updates name and updated_at", async () => {
      await store.updateApplication("app1", { name: "New Name" });

      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
      expect(mockWhere).toHaveBeenCalledWith("id", "app1");
      expect(mockUpdate).toHaveBeenCalled();
    });

    it("updateApplicationAdmins replaces all admins in transaction", async () => {
      await store.updateApplicationAdmins("app1", ["user1", "user2"]);

      expect(mockTransaction).toHaveBeenCalled();
      // Verify delete operation for existing admins
      expect(mockWhere).toHaveBeenCalledWith("application_id", "app1");
      expect(mockDel).toHaveBeenCalled();
      // Verify insert operations for new admins (2 admins = 2 inserts)
      expect(mockInsert).toHaveBeenCalled();
      expect(mockInsert.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    it("updateApplicationAdmins handles empty admin list", async () => {
      jest.clearAllMocks(); // Clear previous test's mock calls

      await store.updateApplicationAdmins("app1", []);

      expect(mockTransaction).toHaveBeenCalled();
      // Verify delete operation still happens (removes all existing admins)
      expect(mockWhere).toHaveBeenCalledWith("application_id", "app1");
      expect(mockDel).toHaveBeenCalled();
      // Verify NO insert operations happen (empty admin list)
      expect(mockInsert).not.toHaveBeenCalled();
    });
  });

  describe("Dev Credentials", () => {
    let originalEnv;

    beforeEach(() => {
      originalEnv = { ...process.env };
      jest.clearAllMocks();
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("insertDevCredentials creates app and key when env vars present", () => {
      process.env.DEV_APPLICATION_ID = "devapp";
      process.env.DEV_KEY_ID = "devkey";
      process.env.DEV_KEY_SECRET = "devsecret";

      store.insertDevCredentials();

      expect(mockKnexInstance).toHaveBeenCalledWith("applications");
    });

    it("insertDevCredentials skips when env vars not present", () => {
      delete process.env.DEV_APPLICATION_ID;
      delete process.env.DEV_KEY_ID;
      delete process.env.DEV_KEY_SECRET;

      store.insertDevCredentials();

      // Should not call knex if env vars not present
      const callCount = mockKnexInstance.mock.calls.length;
      expect(callCount).toBe(0);
    });
  });
});
