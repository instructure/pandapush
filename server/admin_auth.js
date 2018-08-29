const basicAuth = require("basic-auth-connect");
const { ExpressOIDC } = require("@okta/oidc-middleware");

// Returns an object with four functions:
//   `logout`: function to call on logout
//   `bouncer`: function to call on routes that must be protected, and should
//     redirect to login.
//   `blocker`: function to call on routes that must be protected, with no
//     login redirect.
//   `getUsername`: function to look up the logged in username and put it on `req`
//
// May also include `router` which will be added to app routes at initialization.

module.exports = function(env) {
  const noAdminAreaAuth = {
    logout: function(req, res, next) {
      next();
    },
    bouncer: function(req, res, next) {
      res.send(403, "Unauthorized");
    },
    blocker: function(req, res, next) {
      res.send(403, "Unauthorized");
    }
  };

  if (env.AUTH_METHOD === "okta") {
    if (
      !env.OKTA_ISSUER ||
      !env.OKTA_CLIENT_ID ||
      !env.OKTA_CLIENT_SECRET ||
      !env.OKTA_REDIRECT_URI
    ) {
      console.warn("OKTA authentication specified, but not configured");
      return noAdminAreaAuth;
    }

    const oidc = new ExpressOIDC({
      issuer: env.OKTA_ISSUER,
      client_id: env.OKTA_CLIENT_ID,
      client_secret: env.OKTA_CLIENT_SECRET,
      redirect_uri: env.OKTA_REDIRECT_URI,
      scope: "openid profile"
    });

    return {
      logout: function(req, res) {
        req.session = null;
        req.logout();
        res.redirect("/");
      },
      bouncer: oidc.ensureAuthenticated(),
      blocker: oidc.ensureAuthenticated(),
      router: oidc.router,
      getUsername: function(req, res, next) {
        if (req.userinfo && req.userinfo.preferred_username) {
          let username = req.userinfo.preferred_username;
          if (env.OKTA_STRIP_DOMAIN) {
            username = username.replace(env.OKTA_STRIP_DOMAIN, "");
          }

          req.username = username;
        }
        next();
      }
    };
  } else if (env.AUTH_METHOD === "basic") {
    if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
      console.warn("Basic authentication specified, but not configured");
      return noAdminAreaAuth;
    }

    const auth = basicAuth(env.ADMIN_USERNAME, env.ADMIN_PASSWORD);

    return {
      logout: function(req, res, next) {
        next();
      },
      bouncer: auth,
      blocker: auth,
      getUsername: function(req, res, next) {
        req.username = req.user;
        next();
      }
    };
  }

  return noAdminAreaAuth;
};
