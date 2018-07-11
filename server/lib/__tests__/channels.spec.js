/* eslint-env jest */

const parse = require("../channels").parse;

describe("channels", () => {
  it("rejects a channel with less than 3 components", () => {
    const o = parse("/foo");
    expect(o).toBeNull();
  });

  it("parses a private channel", () => {
    const o = parse("/app/private/foo");
    expect(o.private).toBe(true);
    expect(o.public).toBeFalsy();
    expect(o.presence).toBeFalsy();
    expect(o.applicationId).toBe("app");
    expect(o.path).toBe("/private/foo");
  });

  it("parses a public channel", () => {
    const o = parse("/app/public/foo");
    expect(o.public).toBe(true);
    expect(o.private).toBeFalsy();
    expect(o.presence).toBeFalsy();
    expect(o.applicationId).toBe("app");
    expect(o.path).toBe("/public/foo");
  });

  it("parses a presence channel", () => {
    const o = parse("/app/presence/foo");
    expect(o.presence).toBe(true);
    expect(o.public).toBeFalsy();
    expect(o.private).toBeFalsy();
    expect(o.applicationId).toBe("app");
    expect(o.path).toBe("/presence/foo");
  });

  it("parses an invalid channel type", () => {
    const o = parse("/app/foo/bar");
    expect(o).toBe(null);
  });
});
