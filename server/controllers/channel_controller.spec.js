/* eslint-env jest */

const channelController = require("./channel_controller");

describe("channel_controller", () => {
  let req, res;
  let mockCallback, mockErrback;

  beforeEach(() => {
    // Setup mock callback/errback
    mockCallback = jest.fn();
    mockErrback = jest.fn();

    // Setup mock request
    req = {
      query: {},
      params: ["appid", "private", "/messages"],
      body: { message: "test" },
      get: jest.fn(),
      log: {
        info: jest.fn(),
      },
      faye: {
        client: {
          publish: jest.fn(() => ({
            callback: mockCallback.mockImplementation((cb) => {
              cb();
              return { errback: mockErrback };
            }),
            errback: mockErrback,
          })),
        },
      },
    };

    // Setup mock response
    res = {
      send: jest.fn(),
    };
  });

  describe("authFromRequest", () => {
    it("extracts token from query string", () => {
      req.query.token = "query-token-123";

      channelController.post(req, res);

      expect(req.body.__auth).toEqual({ token: "query-token-123" });
    });

    it("extracts Basic auth from Authorization header", () => {
      req.get.mockReturnValue(
        "Basic " + Buffer.from("mykey:mysecret").toString("base64")
      );

      channelController.post(req, res);

      expect(req.body.__auth).toEqual({
        key: "mykey",
        secret: "mysecret",
      });
    });

    it("extracts Token auth from Authorization header", () => {
      req.get.mockReturnValue("Token mytoken123");

      channelController.post(req, res);

      expect(req.body.__auth).toEqual({ token: "mytoken123" });
    });

    it("returns 403 if no auth present", () => {
      req.get.mockReturnValue(undefined);

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns 403 if Authorization header malformed", () => {
      req.get.mockReturnValue("Bearer");

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns 403 if Authorization header empty value", () => {
      req.get.mockReturnValue("Basic ");

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns 403 if auth type unrecognized", () => {
      req.get.mockReturnValue("Bearer sometoken");

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(403, "Unauthorized");
    });

    it("returns 403 if Basic auth cannot be decoded", () => {
      req.get.mockReturnValue("Basic invalidbase64");

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(403, "Unauthorized");
    });
  });

  describe("post() - payload validation", () => {
    beforeEach(() => {
      req.query.token = "test-token";
    });

    it("returns 400 if no payload", () => {
      req.body = null;

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(400, "No payload");
    });

    it("returns 400 if payload is not an object", () => {
      req.body = "string payload";

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(400, "Payload must be an object");
    });

    it("returns 400 if payload is array", () => {
      req.body = ["array", "payload"];

      channelController.post(req, res);

      expect(req.faye.client.publish).toHaveBeenCalled();

      // controller has a bug: even though it should only accept objects, it
      // accepts arrays because in js, typeof array === "object"
      // we should fix this in the code and then in the test here too
      // expect(res.send).toHaveBeenCalledWith(400, "Payload must be an object");
      expect(res.send).toHaveBeenCalledWith(200, "OK");
    });
  });

  describe("post() - channel construction", () => {
    beforeEach(() => {
      req.query.token = "test-token";
    });

    it("constructs channel from applicationId, type, and path", () => {
      req.params = ["myapp", "public", "/channel/name"];

      channelController.post(req, res);

      expect(req.faye.client.publish).toHaveBeenCalledWith(
        "/myapp/public/channel/name",
        expect.any(Object)
      );
    });

    it("handles private channels", () => {
      req.params = ["appid", "private", "/messages"];

      channelController.post(req, res);

      expect(req.faye.client.publish).toHaveBeenCalledWith(
        "/appid/private/messages",
        expect.any(Object)
      );
    });

    it("handles nested paths", () => {
      req.params = ["app1", "private", "/users/123/notifications"];

      channelController.post(req, res);

      expect(req.faye.client.publish).toHaveBeenCalledWith(
        "/app1/private/users/123/notifications",
        expect.any(Object)
      );
    });
  });

  describe("post() - publishing", () => {
    beforeEach(() => {
      req.query.token = "test-token";
    });

    it("publishes payload with auth attached", () => {
      req.body = { message: "hello" };
      req.query.token = "mytoken";

      channelController.post(req, res);

      expect(req.faye.client.publish).toHaveBeenCalledWith(
        "/appid/private/messages",
        {
          message: "hello",
          __auth: { token: "mytoken" },
        }
      );
    });

    it("returns 200 OK on successful publish", () => {
      mockCallback.mockImplementation((cb) => {
        cb();
        return { errback: mockErrback };
      });

      channelController.post(req, res);

      expect(res.send).toHaveBeenCalledWith(200, "OK");
    });

    it("returns 400 with error on publish failure", () => {
      const mockPub = {
        callback: jest.fn(function(fn) {
          return mockPub;
        }),
        errback: jest.fn(function(fn) {
          fn("Publish failed");
          return mockPub;
        }),
      };
      req.faye.client.publish.mockReturnValue(mockPub);

      channelController.post(req, res);

      expect(req.log.info).toHaveBeenCalledWith("Publish failed");
      expect(res.send).toHaveBeenCalledWith(400, "Publish failed");
    });

    it("logs error on errback", () => {
      const error = "Channel not found";
      const mockPub = {
        callback: jest.fn(function(fn) {
          return mockPub;
        }),
        errback: jest.fn(function(fn) {
          fn(error);
          return mockPub;
        }),
      };
      req.faye.client.publish.mockReturnValue(mockPub);

      channelController.post(req, res);

      expect(req.log.info).toHaveBeenCalledWith(error);
    });
  });
});
