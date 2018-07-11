/* eslint-env jest */

const awsOptions = require("../aws_options");

describe("aws_options", () => {
  it("includes endpoint when specified", () => {
    const o = awsOptions("http://localhost/");
    expect(o.endpoint).toBe("http://localhost/");
  });

  it("sets ssl with https", () => {
    const o = awsOptions("https://localhost/");
    expect(o.sslEnabled).toBe(true);
  });

  it("doesn't set ssl without https", () => {
    const o = awsOptions("http://localhost/");
    expect(o.sslEnabled).toBe(false);
  });

  it("creates an agent for https", () => {
    const o = awsOptions("https://localhost/");
    const agent = o.httpOptions.agent;
    expect(agent).toBeDefined();
    expect(agent.maxSockets).toBe(500);
    expect(agent.rejectUnauthorized).toBe(true);
  });

  it("created an ssl agent when no endpoint specified", () => {
    const o = awsOptions();
    expect(o.sslEnabled).toBe(true);
  });
});
