/* eslint-env jest */

const generate = require("../token").generate;

describe("token", () => {
  it("returns a token via promise", done => {
    generate(10).then(token => {
      expect(token).toBeDefined();
      done();
    });
  });

  it("returns a token via callback", done => {
    generate(10, token => {
      expect(token).toBeDefined();
      done();
    });
  });

  it("returns a token of the specified length", done => {
    generate(1)
      .then(token1 => {
        expect(token1.length).toBe(1);
        return generate(10);
      })
      .then(token10 => {
        expect(token10.length).toBe(10);
        return generate(100);
      })
      .then(token100 => {
        expect(token100.length).toBe(100);
        done();
      });
  });
});
