/* eslint-env jest */

jest.mock("../statsd");
const statsd = require("../statsd");

const httpMetrics = require("../http_metrics");

let handlers = {};
const httpStub = {
  on: (event, func) => {
    handlers[event] = func;
  }
};

beforeEach(() => {
  handlers = {};
  statsd.gauge.mockClear();
});

// simple client mock that just pushes everything
// published to the same subscriber
const clientMock = () => {
  let subscriber;

  return {
    publish: (channel, data) => subscriber(data),
    subscribe: (channel, cb) => {
      subscriber = cb;
    }
  };
};

const log = { info: jest.fn() };

it("resubscribes when no messages received", () => {
  const unsubscribeMock = jest.fn();
  const clientMock2 = {
    publish: jest.fn(),
    subscribe: jest.fn(() => {
      return { cancel: unsubscribeMock };
    })
  };

  const h = httpMetrics(httpStub, log, clientMock2);

  expect(clientMock2.subscribe).toHaveBeenCalledTimes(1);
  expect(unsubscribeMock).toHaveBeenCalledTimes(0);

  h.sendStatsToStatsd();
  expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  expect(clientMock2.subscribe).toHaveBeenCalledTimes(2);
});

it("tracks open http connections", () => {
  const h = httpMetrics(httpStub, log, clientMock());
  let close;
  handlers.connection({
    on: (event, fn) => {
      close = fn;
    }
  });

  h.sendStats();
  h.sendStatsToStatsd();
  expect(statsd.gauge).toHaveBeenCalledTimes(1);
  expect(statsd.gauge).toHaveBeenCalledWith("connections.http", 1);
  statsd.gauge.mockClear();

  close();

  h.sendStats();
  h.sendStatsToStatsd();
  expect(statsd.gauge).toHaveBeenCalledTimes(0);
});

it("tracks open ws connections", () => {
  const h = httpMetrics(httpStub, log, clientMock());
  let close;
  handlers.upgrade(null, {
    on: (event, fn) => {
      close = fn;
    }
  });

  h.sendStats();
  h.sendStatsToStatsd();
  expect(statsd.gauge).toHaveBeenCalledTimes(1);
  expect(statsd.gauge).toHaveBeenCalledWith("connections.ws", 1);
  statsd.gauge.mockClear();

  close();

  h.sendStats();
  h.sendStatsToStatsd();
  expect(statsd.gauge).toHaveBeenCalledTimes(0);
});

it("aggregates the data from multiple sources", () => {
  const client = clientMock();
  const h = httpMetrics(httpStub, log, client);
  client.publish("channel", {
    source: "host1",
    stats: {
      connections: 2,
      wsConnections: 1
    }
  });
  client.publish("channel", {
    source: "host2",
    stats: {
      connections: 5,
      wsConnections: 2
    }
  });
  h.sendStats();
  h.sendStatsToStatsd();

  expect(statsd.gauge).toHaveBeenCalledWith("connections.http", 7);
  expect(statsd.gauge).toHaveBeenCalledWith("connections.ws", 3);
});
