/* eslint-env jest */

// Mock dependencies
jest.mock("../../lib/store");
jest.mock("jsonwebtoken");
jest.mock("moment");

const adminController = require("../admin_controller");
const store = require("../../lib/store");
const jwt = require("jsonwebtoken");
const moment = require("moment");

describe("admin_controller", () => {
  let req, res, next;
  let originalEnv;

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };

    // Reset mocks
    jest.clearAllMocks();

    // Setup mock request
    req = {
      username: "testuser",
      user: "testuser",
      params: {},
      body: {},
      application: null,
      applications: null
    };

    // Setup mock response
    res = {
      json: jest.fn(),
      send: jest.fn(),
      sendfile: jest.fn()
    };

    // Setup mock next
    next = jest.fn();

    // Setup mock moment
    const mockMoment = {
      toISOString: jest.fn(() => "2024-12-31T23:59:59.000Z"),
      add: jest.fn().mockReturnThis(),
      unix: jest.fn(() => 1735689599),
      isBefore: jest.fn(() => false)
    };
    moment.mockReturnValue(mockMoment);

    // Setup mock store methods
    store.getApplicationsForUser = jest.fn().mockResolvedValue([]);
    store.getApplicationForUserById = jest.fn().mockResolvedValue(null);
    store.getApplicationKeys = jest.fn().mockResolvedValue([]);
    store.getApplicationUsers = jest.fn().mockResolvedValue([]);
    store.addApplication = jest
      .fn()
      .mockResolvedValue({ id: "app1", name: "Test App" });
    store.updateApplication = jest.fn().mockResolvedValue(1);
    store.updateApplicationAdmins = jest.fn().mockResolvedValue(true);
    store.removeApplication = jest.fn().mockResolvedValue(true);
    store.addKey = jest
      .fn()
      .mockResolvedValue({ id: "key1", secret: "secret1" });

    // Setup mock jwt
    jwt.sign = jest.fn(() => "mock.jwt.token");
  });

  afterEach(() => {
    // Restore env
    process.env = originalEnv;
  });

  describe("getInfo", () => {
    it("returns username from request", () => {
      req.username = "johndoe";

      adminController.getInfo(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][1];
      expect(response.username).toBe("johndoe");
    });

    it("parses ENVIRONMENTS env var into array", () => {
      process.env.ENVIRONMENTS =
        "dev,http://dev.example.com;prod,http://prod.example.com";

      adminController.getInfo(req, res);

      const response = res.json.mock.calls[0][1];
      expect(response.environments).toEqual([
        { name: "dev", url: "http://dev.example.com" },
        { name: "prod", url: "http://prod.example.com" }
      ]);
    });

    it("returns environment from CG_ENVIRONMENT", () => {
      process.env.CG_ENVIRONMENT = "production";

      adminController.getInfo(req, res);

      const response = res.json.mock.calls[0][1];
      expect(response.environment).toBe("production");
    });

    it("defaults to local environment", () => {
      delete process.env.CG_ENVIRONMENT;

      adminController.getInfo(req, res);

      const response = res.json.mock.calls[0][1];
      expect(response.environment).toBe("local");
    });

    it("returns version from CG_GIT_COMMIT_ID", () => {
      process.env.CG_GIT_COMMIT_ID = "abc123";

      adminController.getInfo(req, res);

      const response = res.json.mock.calls[0][1];
      expect(response.version).toBe("abc123");
    });

    it("returns empty environments if env var not set", () => {
      delete process.env.ENVIRONMENTS;

      adminController.getInfo(req, res);

      const response = res.json.mock.calls[0][1];
      expect(response.environments).toEqual([]);
    });
  });

  describe("getApplications middleware chain", () => {
    it("calls loadUserFromRequest and next when user exists", () => {
      const [loadUserFromRequest] = adminController.getApplications;

      loadUserFromRequest(req, res, next);

      expect(req.user).toBe("testuser");
      expect(next).toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it("sends 403 when no username", () => {
      const [loadUserFromRequest] = adminController.getApplications;
      delete req.username;

      loadUserFromRequest(req, res, next);

      expect(res.send).toHaveBeenCalledWith(403, "No user.");
      expect(next).not.toHaveBeenCalled();
    });

    it("loads applications for user", async () => {
      const [, loadApplicationsForUser] = adminController.getApplications;
      const mockApps = [{ id: "app1" }, { id: "app2" }];
      store.getApplicationsForUser.mockResolvedValue(mockApps);

      loadApplicationsForUser(req, res, next);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.getApplicationsForUser).toHaveBeenCalledWith("testuser");
      expect(req.applications).toEqual(mockApps);
      expect(next).toHaveBeenCalled();
    });

    it("sends 500 on store error", async () => {
      const [, loadApplicationsForUser] = adminController.getApplications;
      store.getApplicationsForUser.mockRejectedValue(new Error("DB error"));

      loadApplicationsForUser(req, res, next);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "Error loading applications.");
    });

    it("returns applications in response", () => {
      const [, , handler] = adminController.getApplications;
      req.applications = [{ id: "app1" }];

      handler(req, res);

      expect(res.json).toHaveBeenCalledWith(200, [{ id: "app1" }]);
    });
  });

  describe("getApplication", () => {
    it("loads application for user", async () => {
      const [, loadApplicationForUser] = adminController.getApplication;
      const mockApp = { id: "app1", name: "Test App" };
      store.getApplicationForUserById.mockResolvedValue(mockApp);
      req.params.applicationId = "app1";

      loadApplicationForUser(req, res, next);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.getApplicationForUserById).toHaveBeenCalledWith(
        "testuser",
        "app1"
      );
      expect(req.application).toEqual(mockApp);
      expect(next).toHaveBeenCalled();
    });

    it("sends 404 when application not found", async () => {
      const [, loadApplicationForUser] = adminController.getApplication;
      store.getApplicationForUserById.mockResolvedValue(null);
      req.params.applicationId = "app1";

      loadApplicationForUser(req, res, next);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(404, "Not found");
      expect(next).not.toHaveBeenCalled();
    });

    it("returns application with keys (secrets omitted) and admins", async () => {
      const [, , handler] = adminController.getApplication;
      req.application = { id: "app1", name: "Test App" };
      const mockKeys = [
        { id: "key1", secret: "secret1", purpose: "test" },
        { id: "key2", secret: "secret2", purpose: "prod" }
      ];
      const mockAdmins = ["user1", "user2"];
      store.getApplicationKeys.mockResolvedValue(mockKeys);
      store.getApplicationUsers.mockResolvedValue(mockAdmins);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.getApplicationKeys).toHaveBeenCalledWith("app1");
      expect(store.getApplicationUsers).toHaveBeenCalledWith("app1");
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][1];
      expect(response.keys).toEqual([
        { id: "key1", purpose: "test" },
        { id: "key2", purpose: "prod" }
      ]);
      expect(response.admins).toEqual(mockAdmins);
    });

    it("sends 500 on error", async () => {
      const [, , handler] = adminController.getApplication;
      req.application = { id: "app1" };
      store.getApplicationKeys.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "Error loading application");
    });
  });

  describe("createApplication", () => {
    it("creates application with name and user", async () => {
      const [, handler] = adminController.createApplication;
      req.body.name = "New App";
      const mockApp = { id: "app1", name: "New App", created_by: "testuser" };
      store.addApplication.mockResolvedValue(mockApp);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.addApplication).toHaveBeenCalledWith("New App", "testuser");
      expect(res.json).toHaveBeenCalledWith(201, mockApp);
    });

    it("sends 500 on error", async () => {
      const [, handler] = adminController.createApplication;
      req.body.name = "New App";
      store.addApplication.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "error creating application");
    });
  });

  describe("deleteApplication", () => {
    it("removes application", async () => {
      const [, , handler] = adminController.deleteApplication;
      req.application = { id: "app1" };

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.removeApplication).toHaveBeenCalledWith("app1");
      expect(res.send).toHaveBeenCalledWith(200);
    });

    it("sends 500 on error", async () => {
      const [, , handler] = adminController.deleteApplication;
      req.application = { id: "app1" };
      store.removeApplication.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "error removing application");
    });
  });

  describe("updateApplication", () => {
    it("updates application name", async () => {
      const [, , handler] = adminController.updateApplication;
      req.application = { id: "app1", name: "Old Name" };
      req.body = { name: "New Name", admins: ["user1"] };

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      // Verify store was called with new name
      expect(store.updateApplication).toHaveBeenCalledWith(
        "app1",
        expect.objectContaining({
          name: "New Name"
        })
      );
      // Verify response confirms the update
      expect(res.json).toHaveBeenCalledWith(200, { id: "app1" });
    });

    it("updates admins", async () => {
      const [, , handler] = adminController.updateApplication;
      req.application = { id: "app1" };
      req.body = { name: "App", admins: ["user1", "user2"] };

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.updateApplicationAdmins).toHaveBeenCalledWith("app1", [
        "user1",
        "user2"
      ]);
      expect(res.json).toHaveBeenCalledWith(200, { id: "app1" });
    });

    it("sends 500 on error", async () => {
      const [, , handler] = adminController.updateApplication;
      req.application = { id: "app1" };
      req.body = { name: "App", admins: [] };
      store.updateApplication.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "error updating application");
    });
  });

  describe("generateKey", () => {
    it("creates key with expires, purpose, and user", async () => {
      const [, , handler] = adminController.generateKey;
      req.application = { id: "app1" };
      req.body = { expires: "2025-01-01T00:00:00Z", purpose: "api" };
      const mockKey = { id: "key1", secret: "secret1" };
      store.addKey.mockResolvedValue(mockKey);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.addKey).toHaveBeenCalledWith(
        "app1",
        "2025-01-01T00:00:00Z",
        "api",
        "testuser"
      );
      expect(res.json).toHaveBeenCalledWith(200, mockKey);
    });

    it("sends 500 on error", async () => {
      const [, , handler] = adminController.generateKey;
      req.application = { id: "app1" };
      req.body = {};
      store.addKey.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "error");
    });
  });

  describe("generateToken", () => {
    it("uses specified keyId if provided", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.params.keyId = "key1";
      req.body = { channel: "/app1/private/test", pub: true };
      const mockKeys = [{ id: "key1", secret: "secret1" }];
      store.getApplicationKeys.mockResolvedValue(mockKeys);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          keyId: "key1",
          channel: "/app1/private/test"
        }),
        "secret1"
      );
      expect(res.json).toHaveBeenCalledWith(200, { token: "mock.jwt.token" });
    });

    it("sends 404 if specified keyId not found", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.params.keyId = "nonexistent";
      req.body = {};
      store.getApplicationKeys.mockResolvedValue([]);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(404, "could not find key");
    });

    it("finds existing web console key", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.body = { channel: "/app1/private/test" };
      const mockKeys = [
        {
          id: "key1",
          secret: "secret1",
          purpose: "web console",
          expires: "2025-01-01T00:00:00Z"
        }
      ];
      store.getApplicationKeys.mockResolvedValue(mockKeys);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ keyId: "key1" }),
        "secret1"
      );
    });

    it("creates new web console key if none exists", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.body = { channel: "/app1/private/test" };
      store.getApplicationKeys.mockResolvedValue([]);
      store.addKey.mockResolvedValue({ id: "newkey", secret: "newsecret" });

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.addKey).toHaveBeenCalledWith(
        "app1",
        expect.any(String),
        "web console",
        "testuser"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ keyId: "newkey" }),
        "newsecret"
      );
    });

    it("generates JWT with correct payload", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.body = {
        channel: "/app1/private/test",
        presence: { id: "user1" },
        pub: true,
        sub: true
      };
      const mockKeys = [
        {
          id: "key1",
          secret: "secret1",
          purpose: "web console",
          expires: "2025-01-01T00:00:00Z"
        }
      ];
      store.getApplicationKeys.mockResolvedValue(mockKeys);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          keyId: "key1",
          channel: "/app1/private/test",
          presence: { id: "user1" },
          pub: true,
          sub: true,
          exp: expect.any(Number)
        },
        "secret1"
      );
    });

    it("uses custom expires or defaults to 1 hour", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.body = { channel: "/app1/private/test" };
      const mockKeys = [
        {
          id: "key1",
          secret: "secret1",
          purpose: "web console",
          expires: "2025-01-01T00:00:00Z"
        }
      ];
      store.getApplicationKeys.mockResolvedValue(mockKeys);

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(moment().add).toHaveBeenCalledWith("hours", 1);
    });

    it("sends 500 on error", async () => {
      const [, , handler] = adminController.generateToken;
      req.application = { id: "app1" };
      req.body = {};
      store.getApplicationKeys.mockRejectedValue(new Error("DB error"));

      handler(req, res);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(res.send).toHaveBeenCalledWith(500, "error");
    });
  });
});
