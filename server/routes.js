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

    const checkAuthAndLoadUser = [auth.blocker, auth.getUsername];

    app.get("/admin/api/info", checkAuthAndLoadUser, admin.getInfo);
    app.get(
      "/admin/api/applications",
      checkAuthAndLoadUser,
      admin.getApplications
    );
    app.post(
      "/admin/api/applications",
      checkAuthAndLoadUser,
      admin.createApplication
    );
    app.get(
      "/admin/api/application/:applicationId",
      checkAuthAndLoadUser,
      admin.getApplication
    );
    app.delete(
      "/admin/api/application/:applicationId",
      checkAuthAndLoadUser,
      admin.deleteApplication
    );
    app.post(
      "/admin/api/application/:applicationId",
      checkAuthAndLoadUser,
      admin.updateApplication
    );
    app.post(
      "/admin/api/application/:applicationId/keys",
      checkAuthAndLoadUser,
      admin.generateKey
    );
    app.post(
      "/admin/api/application/:applicationId/token",
      checkAuthAndLoadUser,
      admin.generateToken
    );
    app.post(
      "/admin/api/application/:applicationId/keys/:keyId/token",
      checkAuthAndLoadUser,
      admin.generateToken
    );
  }
};
