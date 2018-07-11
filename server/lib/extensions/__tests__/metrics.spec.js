/* eslint-env jest */

jest.mock("../../statsd");
const statsd = require("../../statsd");
const metrics = require("../metrics");

let handlers = {};
const fayeStub = {
  on: (event, func) => {
    handlers[event] = func;
  }
};

describe("faye metrics extension", function() {
  let m;

  beforeEach(() => {
    handlers = {};
    m = metrics(fayeStub);
    statsd.count.mockClear();
  });

  it("increments on handshake", () => {
    handlers.handshake();
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(1);
    expect(statsd.count).toHaveBeenCalledWith("handshake", 1);
  });

  it("increments on close", () => {
    handlers.close();
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(1);
    expect(statsd.count).toHaveBeenCalledWith("close", 1);
  });

  it("increments on disconnect", () => {
    handlers.disconnect();
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(1);
    expect(statsd.count).toHaveBeenCalledWith("disconnect", 1);
  });

  it("increments for app on subscribe", () => {
    handlers.subscribe("clientId", "/appid/private/foo");
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(2);
    expect(statsd.count).toHaveBeenCalledWith("subscribe", 1);
    expect(statsd.count).toHaveBeenCalledWith("apps.appid.subscribe", 1);
  });

  it("increments for app on unsubscribe", () => {
    handlers.unsubscribe("clientId", "/appid/private/foo");
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(2);
    expect(statsd.count).toHaveBeenCalledWith("unsubscribe", 1);
    expect(statsd.count).toHaveBeenCalledWith("apps.appid.unsubscribe", 1);
  });

  it("increments for app on publish", () => {
    handlers.publish("clientId", "/appid/private/foo");
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(2);
    expect(statsd.count).toHaveBeenCalledWith("publish", 1);
    expect(statsd.count).toHaveBeenCalledWith("apps.appid.publish", 1);
  });

  it("doesn't increment channel stats for meta", () => {
    handlers.publish("clientId", "/internal/meta/foo");
    m.flush();
    expect(statsd.count).toHaveBeenCalledTimes(1);
    expect(statsd.count).toHaveBeenCalledWith("publish", 1);
  });
});
