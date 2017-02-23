/* eslint-env jest */

const routes = require('../routes');

const AppMock = function () {
  this.routes = [];

  this.collect = verb => {
    return (path, ...middlewares) => {
      const route = [ verb, path ].concat(middlewares);
      this.routes.push(route);
    };
  };

  this.get = this.collect('get');
  this.post = this.collect('post');
  this.delete = this.collect('delete');
};

it('requires auth.blocker for all admin api calls', () => {
  const app = new AppMock();

  const auth = {
    blocker: 'blocker',
    bouncer: 'bouncer'
  };

  routes.map(app, auth);

  let expectations = 0;
  app.routes.forEach(route => {
    if (route[1].indexOf && route[1].indexOf('/admin/') === 0) {
      expect(route[2]).toBe(auth.blocker);
      expectations += 1;
    }
  });

  // sanity check, to make sure we actually did some verification above.
  expect(expectations).toBeGreaterThan(5);
});
