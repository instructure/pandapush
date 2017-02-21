/* eslint-env jest */

// This is not a great spec. Mostly because the function under
// test is mostly just glue.

const faye = require('../index');

jest.mock('faye');
const Faye = require('faye');
Faye.NodeAdapter = function (options) {
  this.options = options;
  this.extensions = [];

  this.getClient = () => { return {}; };
  this.attach = jest.fn();
  this.addExtension = (extension) => {
    this.extensions.push(extension);
  };
};

jest.mock('faye-presence');
jest.mock('../../extensions/auth');
jest.mock('../../extensions/metrics');

const metrics = require('../../extensions/metrics');
metrics.mockReturnValue({ start: jest.fn() });

it('returns the newly created clients', () => {
  const clients = faye({});
  expect(clients.client).toEqual({});
  expect(clients.internalClient).toBeDefined();
});
