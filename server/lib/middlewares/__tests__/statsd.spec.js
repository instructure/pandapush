/* eslint-env jest */

jest.mock("../../statsd");
const statsd = require("../../statsd");
const statsdMw = require("../statsd");

const mockRes = {
  on: (event, cb) => {
    mockRes.cb = cb;
  },
  removeListener: jest.fn(),
  _headers: {},
  statusCode: 200
};

it("updates statsd on requests", done => {
  const nowSpy = jest
    .spyOn(Date, "now")
    .mockReturnValueOnce(100)
    .mockReturnValueOnce(250);

  statsdMw()({}, mockRes, () => {
    mockRes.cb();

    expect(nowSpy).toHaveBeenCalledTimes(2);
    expect(statsd.increment).toHaveBeenCalledWith("responses.all.200");
    expect(statsd.timing).toHaveBeenCalledWith("duration.all", 150);
    done();
  });
});
