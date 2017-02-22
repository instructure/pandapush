/* eslint-env jest */

const logger = require('../logger');

const mockLog = {
  info: (obj) => {
    mockLog.obj = obj;
  },
  child: () => mockLog
};

const mockRes = {
  on: (event, cb) => {
    mockRes.cb = cb;
  },
  removeListener: jest.fn(),
  _headers: {}
};

const mockReq = {
  headers: {},
  log: mockLog
};

it('logs the duration of a request', (done) => {
  const nowSpy = jest.spyOn(Date, 'now')
    .mockReturnValueOnce(100)
    .mockReturnValueOnce(250);

  logger(mockLog)(mockReq, mockRes, () => {
    mockRes.cb();

    expect(nowSpy).toHaveBeenCalledTimes(2);
    expect(mockLog.obj['duration']).toBe(150);
    done();
  });
});
