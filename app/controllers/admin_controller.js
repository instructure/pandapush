'use strict'

var path         = require('path'),
    _            = require('lodash'),
    moment       = require('moment'),
    jwt          = require('jsonwebtoken'),
    store        = require('../lib/store');

exports.index = function(req, res) {
  res.sendfile(path.resolve(__dirname + '/../../ui/public/admin/index.html'));
};

exports.getInfo = function(req, res) {
  res.json(200, {
    username: req.user || req.session.cas_user
  });
};

exports.getApplications = function(req, res) {
  store.getAllForUser(req.user || req.session.cas_user, function(err, apps) {
    if (err) {
      console.log("error getting applications", err);
      return res.send(500, "an error occurred");
    }

    // redact keys
    _.forEach(apps, function(app) {
      _.forEach(app.keys, function(key) {
        key.secret = '********************';
      });
    });

    res.json(200, _.values(apps));
  });
};

exports.generateKey = function(req, res) {
  store.getAllForUser(req.user || req.session.cas_user, function(err, apps) {
    if (err) {
      console.log("error getting applications", err);
      return res.send(500, "error");
    }

    // find app
    var application = apps[req.params.applicationId];
    if (!application) {
      console.log("couldn't find application");
      return res.send(404, "could not find application");
    }

    store.addKey(application.application_id, {
      user: req.user || req.session.cas_user,
      expires: req.body.expires,
      purpose: req.body.purpose
    }, function(err, info) {
      if (err) {
        console.log("error generating key:", err);
        return res.send(500, "error");
      }

      return res.json(200, info);
    });
  });
};

exports.revokeKey = function(req, res) {
};

exports.createApplication = function(req, res) {
  store.addApplication({
    name: req.body.name,
    user: req.user || req.session.cas_user,
    admins: [ req.user || req.session.cas_user ]
  }, function(err, applicationId) {
    return res.json(200, {
      application_id: applicationId
    });
  });
};

exports.generateToken = function(req, res) {
  var user = req.user || req.session.cas_user;

  store.getAllForUser(user, function(err, apps) {
    if (err) {
      console.log("error getting applications", err);
      return res.send(500, "error");
    }

    // find app
    var application = apps[req.params.applicationId];
    if (!application) {
      console.log("couldn't find application");
      return res.send(404, "could not find application");
    }

    var lookupKey = function(done) {
      // find key
      var key = null;

      if (req.params.keyId) {
        key = application.keys[req.params.keyId];
        if (!key) {
          console.log("couldn't find key");
          return res.send(404, "could not find key");
        }

        done(key);
      }
      else {
        // no key was specified, so find the "web console" purpose key and create if necessary
        key = _.find(application.keys, function(key) {
          return key.purpose == "web console" &&
                 !key.revoked_at &&
                 !moment(key.expires_at).isBefore(moment());
        });

        if (key) {
          done(key);
        }
        else {
          store.addKey(application.application_id, {
            user: user,
            expires: moment().add('years', 1).toISOString(),
            purpose: "web console"
          }, function(err, key) {
            if (err) {
              console.log("error generating web console key:", err);
              return res.send(500, "error");
            }

            done(key);
          });
        }
      }
    }

    lookupKey(function(key) {
      var expires = req.body.expires && moment(req.body.expires) || moment().add('hours', 1);

      var payload = {
        keyId: key.key_id,
        channel: req.body.channel,
        pub: req.body.pub,
        sub: req.body.sub,
        exp: expires.unix()
      };

      var token = jwt.sign(payload, key.secret);

      res.json(200, {
        token: token
      });
    });
  });
};
