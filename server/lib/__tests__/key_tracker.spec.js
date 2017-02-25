/* eslint-env jest */

jest.mock('../store');
const store = require('../store');

store.addKeyUsage.mockImplementation(() => {
  return new Promise(resolve => resolve());
});

const keyTracker = require('../key_tracker');

it('calls the store addKeyUsage for every key added', () => {
  const t = keyTracker();
  t.record('appid1', 'keyid1');
  t.record('appid2', 'keyid2');
  t.writeStats();

  expect(store.addKeyUsage).toHaveBeenCalledTimes(2);
});
