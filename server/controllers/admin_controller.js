const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const store = require("../lib/store");

exports.index = function(req, res) {
  res.sendfile(
    path.resolve(path.join(__dirname, "../../ui/public/admin/index.html"))
  );
};

exports.getInfo = function(req, res) {
  res.json(200, { username: req.username });
};

const loadUserFromRequest = function(req, res, next) {
  const user = req.username;
  if (!user) {
    console.log("no user in request");
    return res.send(403, "No user.");
  }

  req.user = user;

  next();
};

const loadApplicationsForUser = function(req, res, next) {
  store
    .getApplicationsForUser(req.user)
    .then(applications => {
      req.applications = applications;

      next();
      return null;
    })
    .catch(err => {
      console.log("error getting applications", err);
      res.send(500, "Error loading applications.");
    });
};

const loadApplicationForUser = function(req, res, next) {
  store
    .getApplicationForUserById(req.user, req.params.applicationId)
    .then(application => {
      if (!application) {
        console.log("could not find application");
        res.send(404, "Not found");
        return null;
      }

      req.application = application;
      next();
      return null;
    })
    .catch(err => {
      console.log("error getting application", err);
      res.send(500, "Error loading application");
    });
};

exports.getApplications = [
  loadUserFromRequest,
  loadApplicationsForUser,
  function(req, res) {
    res.json(200, req.applications);
  }
];

exports.getApplication = [
  loadUserFromRequest,
  loadApplicationForUser,
  function(req, res) {
    const application = req.application;
    const response = _.extend({}, application);

    store
      .getApplicationKeys(application.id)
      .then(keys => {
        response.keys = _.map(keys, key => _.omit(key, "secret"));
        return store.getApplicationUsers(application.id);
      })
      .then(users => {
        response.admins = users;
        res.json(200, response);
      })
      .catch(err => {
        console.log("error getting application keys", err);
        res.send(500, "Error loading application");
      });
  }
];

exports.generateKey = [
  loadUserFromRequest,
  loadApplicationForUser,
  function(req, res) {
    const application = req.application;

    store
      .addKey(application.id, req.body.expires, req.body.purpose, req.user)
      .then(key => {
        res.json(200, key);
      })
      .catch(err => {
        console.log("error generating key", err);
        res.send(500, "error");
      });
  }
];

exports.revokeKey = function(req, res) {};

exports.createApplication = [
  loadUserFromRequest,
  function(req, res) {
    store
      .addApplication(req.body.name, req.user)
      .then(application => {
        res.json(200, application);
      })
      .catch(err => {
        console.log("error creating application", err);
        res.send(500, "error creating application");
      });
  }
];

exports.deleteApplication = [
  loadUserFromRequest,
  loadApplicationForUser,
  function(req, res) {
    const application = req.application;

    store
      .removeApplication(application.id)
      .then(() => {
        console.log("done removing");
        res.send(200);
      })
      .catch(err => {
        console.log("error removing application", err);
        res.send(500, "error removing application");
      });
  }
];

exports.updateApplication = [
  loadUserFromRequest,
  loadApplicationForUser,
  function(req, res) {
    const application = req.application;

    const attributes = _.extend({}, application, {
      name: req.body.name
    });

    store
      .updateApplication(application.id, attributes)
      .then(() => {
        return store.updateApplicationAdmins(application.id, req.body.admins);
      })
      .then(() => {
        res.json(200, {
          id: application.id
        });
      })
      .catch(err => {
        console.log("error updating application", err);
        return res.send(500, "error updating application");
      });
  }
];

exports.generateToken = [
  loadUserFromRequest,
  loadApplicationForUser,
  function(req, res) {
    const user = req.user;
    const application = req.application;

    store
      .getApplicationKeys(application.id)
      .then(keys => {
        let key;

        if (req.params.keyId) {
          key = _.find(keys, ["id", req.params.keyId]);
          if (!key) {
            console.log("could not find key");
            return res.send(404, "could not find key");
          }

          return new Promise(resolve => resolve(key));
        }

        key = _.find(keys, function(key) {
          return (
            key.purpose === "web console" &&
            !key.revoked_at &&
            !moment(key.expires).isBefore(moment())
          );
        });

        if (key) {
          return new Promise(resolve => resolve(key));
        }

        const expires = moment()
          .add("years", 10)
          .toISOString();
        return store.addKey(application.id, expires, "web console", user);
      })
      .then(key => {
        const expires =
          (req.body.expires && moment(req.body.expires)) ||
          moment().add("hours", 1);

        const payload = {
          keyId: key.id,
          channel: req.body.channel,
          presence: req.body.presence,
          pub: req.body.pub,
          sub: req.body.sub,
          exp: expires.unix()
        };

        const token = jwt.sign(payload, key.secret);

        res.json(200, {
          token: token
        });
      })
      .catch(err => {
        console.log("error getting web console key", err);
        return res.send(500, "error");
      });
  }
];
