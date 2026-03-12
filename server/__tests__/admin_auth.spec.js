/* eslint-env jest */

// Mock dependencies before requiring admin_auth
jest.mock("@okta/oidc-middleware", () => {
  return {
    ExpressOIDC: jest.fn().mockImplementation(() => {
      return {
        ensureAuthenticated: jest.fn(() => jest.fn((req, res, next) => next())),
        router: {}
      };
    })
  };
});

jest.mock("basic-auth-connect", () => {
  return jest.fn(() => jest.fn((req, res, next) => next()));
});

const createAdminAuth = require("../admin_auth");

describe("admin_auth", () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("when AUTH_METHOD is not set", () => {
    let env;
    let auth;

    beforeEach(() => {
      env = {};
      auth = createAdminAuth(env);
    });

    it("returns auth object with all required methods defined", () => {
      expect(auth.logout).toBeDefined();
      expect(auth.bouncer).toBeDefined();
      expect(auth.blocker).toBeDefined();
      expect(auth.getUsername).toBeDefined();
    });

    it("bouncer returns 403", () => {
      const mockRes = { send: jest.fn() };

      auth.bouncer({}, mockRes, jest.fn());

      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("blocker returns 403", () => {
      const mockRes = { send: jest.fn() };

      auth.blocker({}, mockRes, jest.fn());

      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("logout calls next without side effects", () => {
      const mockNext = jest.fn();

      auth.logout({}, {}, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("getUsername calls next without setting username", () => {
      const mockReq = {};
      const mockNext = jest.fn();

      auth.getUsername(mockReq, {}, mockNext);

      expect(mockReq.username).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when AUTH_METHOD is "okta"', () => {
    it("returns noAdminAreaAuth when Okta config is incomplete - missing all", () => {
      const env = {
        AUTH_METHOD: "okta"
        // Missing all Okta config
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing OKTA_ISSUER", () => {
      const env = {
        AUTH_METHOD: "okta",
        OKTA_CLIENT_ID: "client123",
        OKTA_CLIENT_SECRET: "secret456",
        OKTA_REDIRECT_URI: "https://pandapush.example.com/callback"
        // Missing OKTA_ISSUER
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing OKTA_CLIENT_ID", () => {
      const env = {
        AUTH_METHOD: "okta",
        OKTA_ISSUER: "https://example.okta.com",
        OKTA_CLIENT_SECRET: "secret456",
        OKTA_REDIRECT_URI: "https://pandapush.example.com/callback"
        // Missing OKTA_CLIENT_ID
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing OKTA_CLIENT_SECRET", () => {
      const env = {
        AUTH_METHOD: "okta",
        OKTA_ISSUER: "https://example.okta.com",
        OKTA_CLIENT_ID: "client123",
        OKTA_REDIRECT_URI: "https://pandapush.example.com/callback"
        // Missing OKTA_CLIENT_SECRET
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing OKTA_REDIRECT_URI", () => {
      const env = {
        AUTH_METHOD: "okta",
        OKTA_ISSUER: "https://example.okta.com",
        OKTA_CLIENT_ID: "client123",
        OKTA_CLIENT_SECRET: "secret456"
        // Missing OKTA_REDIRECT_URI
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    describe("when fully configured", () => {
      let env;
      let auth;

      beforeEach(() => {
        env = {
          AUTH_METHOD: "okta",
          OKTA_ISSUER: "https://example.okta.com",
          OKTA_CLIENT_ID: "client123",
          OKTA_CLIENT_SECRET: "secret456",
          OKTA_REDIRECT_URI: "https://pandapush.example.com/callback"
        };
        auth = createAdminAuth(env);
      });

      it("creates auth object with correct properties", () => {
        expect(auth.router).toBeDefined();
        expect(auth.bouncer).toBeDefined();
        expect(auth.blocker).toBeDefined();
        expect(auth.logout).toBeDefined();
        expect(auth.getUsername).toBeDefined();
      });

      it("getUsername extracts preferred_username from userinfo", () => {
        const mockReq = {
          userinfo: { preferred_username: "testuser@example.com" }
        };
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBe("testuser@example.com");
        expect(mockNext).toHaveBeenCalled();
      });

      it("getUsername strips domain when OKTA_STRIP_DOMAIN is set", () => {
        env.OKTA_STRIP_DOMAIN = "@example.com";
        auth = createAdminAuth(env);

        const mockReq = {
          userinfo: { preferred_username: "testuser@example.com" }
        };
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBe("testuser");
        expect(mockNext).toHaveBeenCalled();
      });

      it("getUsername handles missing userinfo", () => {
        const mockReq = {};
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBeUndefined();
        expect(mockNext).toHaveBeenCalled();
      });

      it("getUsername handles missing preferred_username", () => {
        const mockReq = {
          userinfo: { email: "test@example.com" }
        };
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBeUndefined();
        expect(mockNext).toHaveBeenCalled();
      });

      it("logout clears session and redirects", () => {
        const mockReq = {
          session: { user: "data" },
          logout: jest.fn()
        };
        const mockRes = {
          redirect: jest.fn()
        };

        auth.logout(mockReq, mockRes);

        expect(mockReq.session).toBeNull();
        expect(mockReq.logout).toHaveBeenCalled();
        expect(mockRes.redirect).toHaveBeenCalledWith("/");
      });
    });
  });

  describe('when AUTH_METHOD is "basic"', () => {
    it("returns noAdminAreaAuth when basic auth config is incomplete - missing all", () => {
      const env = {
        AUTH_METHOD: "basic"
        // Missing ADMIN_USERNAME and ADMIN_PASSWORD
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing ADMIN_USERNAME", () => {
      const env = {
        AUTH_METHOD: "basic",
        ADMIN_PASSWORD: "password123"
        // Missing ADMIN_USERNAME
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns noAdminAreaAuth when missing ADMIN_PASSWORD", () => {
      const env = {
        AUTH_METHOD: "basic",
        ADMIN_USERNAME: "admin"
        // Missing ADMIN_PASSWORD
      };

      const auth = createAdminAuth(env);
      const mockRes = { send: jest.fn() };
      auth.bouncer({}, mockRes, jest.fn());
      expect(mockRes.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    describe("when fully configured", () => {
      let env;
      let auth;

      beforeEach(() => {
        env = {
          AUTH_METHOD: "basic",
          ADMIN_USERNAME: "admin",
          ADMIN_PASSWORD: "password123"
        };
        auth = createAdminAuth(env);
      });

      it("creates auth object with correct properties", () => {
        expect(auth.bouncer).toBeDefined();
        expect(auth.blocker).toBeDefined();
        expect(auth.logout).toBeDefined();
        expect(auth.getUsername).toBeDefined();
        expect(auth.router).toBeUndefined(); // Basic auth doesn't have router
      });

      it("getUsername sets username from req.user", () => {
        const mockReq = { user: "adminuser" };
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBe("adminuser");
        expect(mockNext).toHaveBeenCalled();
      });

      it("getUsername handles missing req.user", () => {
        const mockReq = {};
        const mockNext = jest.fn();

        auth.getUsername(mockReq, {}, mockNext);

        expect(mockReq.username).toBeUndefined();
        expect(mockNext).toHaveBeenCalled();
      });

      it("logout calls next without clearing session", () => {
        const mockReq = { session: { data: "test" } };
        const mockNext = jest.fn();

        auth.logout(mockReq, {}, mockNext);

        expect(mockReq.session).toEqual({ data: "test" }); // Session unchanged
        expect(mockNext).toHaveBeenCalled();
      });
    });
  });
});
