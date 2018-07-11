/* eslint-env jest */

jest.mock("faye");
const Faye = require("faye");
Faye.Client = class {
  constructor(server) {
    this.extensions = [];
  }

  addExtension(ext) {
    this.extensions.push(ext);
  }
};

const internalClient = require("../internal_client");

it("adds the internal token to outgoing messages", done => {
  const client = internalClient("token", {});
  client.extensions[0].outgoing({}, message => {
    expect(message).toEqual({ ext: { internalToken: "token" } });
    done();
  });
});
