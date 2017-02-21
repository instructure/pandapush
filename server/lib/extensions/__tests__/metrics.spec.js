/* eslint-env mocha */

const sinon = require('sinon');
const proxyquire = require('proxyquire');
const assert = require('power-assert');

const statsdStub = {
  count: sinon.stub()
};

let handlers = {};
const bayeuxStub = {
  on: (event, func) => {
    handlers[event] = func;
  }
};

const metrics = proxyquire('../metrics', {
  '../statsd': statsdStub
});

describe('bayeux metrics extension', function () {
  let m;

  beforeEach(() => {
    handlers = {};
    m = metrics(bayeuxStub);
    statsdStub.count.reset();
  });

  it('increments on handshake', () => {
    handlers.handshake();
    m.flush();
    assert(statsdStub.count.calledOnce);
    assert(statsdStub.count.calledWith('handshake', 1));
  });

  it('increments on close', () => {
    handlers.close();
    m.flush();
    assert(statsdStub.count.calledOnce);
    assert(statsdStub.count.calledWith('close', 1));
  });

  it('increments on disconnect', () => {
    handlers.disconnect();
    m.flush();
    assert(statsdStub.count.calledOnce);
    assert(statsdStub.count.calledWith('disconnect', 1));
  });

  it('increments for app on subscribe', () => {
    handlers.subscribe('clientId', '/appid/private/foo');
    m.flush()
    assert(statsdStub.count.calledTwice);
    assert(statsdStub.count.calledWith('subscribe', 1));
    assert(statsdStub.count.calledWith('apps.appid.subscribe', 1));
  });

  it('increments for app on unsubscribe', () => {
    handlers.unsubscribe('clientId', '/appid/private/foo');
    m.flush()
    assert(statsdStub.count.calledTwice);
    assert(statsdStub.count.calledWith('unsubscribe', 1));
    assert(statsdStub.count.calledWith('apps.appid.unsubscribe', 1));
  });

  it('increments for app on publish', () => {
    handlers.publish('clientId', '/appid/private/foo');
    m.flush()
    assert(statsdStub.count.calledTwice);
    assert(statsdStub.count.calledWith('publish', 1));
    assert(statsdStub.count.calledWith('apps.appid.publish', 1));
  });

  it('doesn\'t increment channel stats for meta', () => {
    handlers.publish('clientId', '/internal/meta/foo');
    m.flush();
    assert(statsdStub.count.calledOnce);
    assert(statsdStub.count.calledWith('publish', 1));
  });
});
