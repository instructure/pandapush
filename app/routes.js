var admin   = require('./controllers/admin_controller'),
    channel = require('./controllers/channel_controller');

exports.map = function(app, auth) {
  app.post(/^\/channel\/([a-zA-Z0-9]+)\/(public|private)((?:\/[a-zA-Z0-9-_~]+)+)$/, channel.post);

  if (auth) {
    app.get('/logout', auth.logout);
    app.get('/admin', auth.bouncer, admin.index);

    app.get('/admin/api/info', auth.blocker, admin.getInfo);
    app.get('/admin/api/applications', auth.blocker, admin.getApplications);
    app.post('/admin/api/applications', auth.blocker, admin.createApplication);
    app.post('/admin/api/application/:applicationId/keys', auth.blocker, admin.generateKey);
    app.post('/admin/api/application/:applicationId/keys/:keyId/token', auth.blocker, admin.generateToken)
  }
}
