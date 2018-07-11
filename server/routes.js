const admin = require("./controllers/admin_controller");
const channel = require("./controllers/channel_controller");
const healthCheck = require("./controllers/health_check_controller");

exports.map = function(app, auth) {
  app.post(
    /^\/channel\/([a-zA-Z0-9]+)\/(public|private)((?:\/[a-zA-Z0-9-_~]+)+)$/,
    channel.post
  );
  app.get("/health_check.json", healthCheck.get);

  if (auth) {
    app.get("/logout", auth.logout);
    app.get("/admin", auth.bouncer, admin.index);

    app.get("/admin/api/info", auth.blocker, admin.getInfo);
    app.get("/admin/api/applications", auth.blocker, admin.getApplications);
    app.post("/admin/api/applications", auth.blocker, admin.createApplication);
    app.get(
      "/admin/api/application/:applicationId",
      auth.blocker,
      admin.getApplication
    );
    app.delete(
      "/admin/api/application/:applicationId",
      auth.blocker,
      admin.deleteApplication
    );
    app.post(
      "/admin/api/application/:applicationId",
      auth.blocker,
      admin.updateApplication
    );
    app.post(
      "/admin/api/application/:applicationId/keys",
      auth.blocker,
      admin.generateKey
    );
    app.post(
      "/admin/api/application/:applicationId/token",
      auth.blocker,
      admin.generateToken
    );
    app.post(
      "/admin/api/application/:applicationId/keys/:keyId/token",
      auth.blocker,
      admin.generateToken
    );
  }
};
