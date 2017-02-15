'use strict';

const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const store = require('../lib/store');

exports.index = function (req, res) {
  res.sendfile(path.resolve(path.join(__dirname, '../../ui/public/admin/index.html')));
};

exports.getInfo = function (req, res) {
  res.json(200, {
    username: req.user || req.session.cas_user
  });
};

const loadUserFromRequest = function(req, res, next) {
  const user = req.user || req.session.cas_user;
  if (!user) {
    console.log('no user in request');
    return res.send(403, 'No user.');
  }

  req.user = user;

  next();
};

const loadApplicationsForUser = function (req, res, next) {
  store.getAllForUser(req.user, function (err, apps) {
    if (err) {
      console.log('error getting applications', err);
      return res.send(500, 'Error loading applications.');
    }

    req.applications = apps;

    next();
  });
};

const loadApplication = function (req, res, next) {
  console.log('applications', req.applications, req.params.applicationId);
  const application = req.applications[req.params.applicationId];
  if (!application) {
    console.log('could not find application');
    return res.send(404, 'Not found');
  }

  req.application = application;

  next();
};

exports.getApplications = [ loadUserFromRequest, loadApplicationsForUser, function (req, res) {
  const applications = req.applications;

  // redact keys
  _.forEach(applications, function (application) {
    _.forEach(application.keys, function (key) {
      key.secret = '********************';
    });
  });

  res.json(200, _.values(applications));
}];

exports.generateKey = [ loadUserFromRequest, loadApplicationsForUser, loadApplication, function (req, res) {
  const application = req.application;

  store.addKey(application.application_id, {
    user: req.user || req.session.cas_user,
    expires: req.body.expires,
    purpose: req.body.purpose
  }, function (err, info) {
    if (err) {
      console.log('error generating key:', err);
      return res.send(500, 'error');
    }

    return res.json(200, info);
  });
}];

exports.revokeKey = function (req, res) {
};

exports.createApplication = [ loadUserFromRequest, function (req, res) {
  store.addApplication({
    name: req.body.name,
    created_by: req.user,
    admins: [ req.user ]
  }, function (err, applicationId) {
    if (err) {
      console.log('error creating application', err);
      return res.send(500, 'error creating application');
    }
    return res.json(200, {
      application_id: applicationId
    });
  });
}];

exports.updateApplication = [ loadUserFromRequest, loadApplicationsForUser, loadApplication, function (req, res) {
  const user = req.user;
  const application = req.application;

  const attributes = _.extend({}, application, {
    name: req.body.name,
    updated_at: moment().toISOString(),
    admins: req.body.admins
  });

  store.updateApplication(application.application_id, attributes, function (err) {
    if (err) {
      console.log('error updating application', err);
      return res.send(500, 'error updating application');
    }

    return res.json(200, {
      application_id: application.id
    });
  });
}];

exports.generateToken = function (req, res) {
  const user = req.user || req.session.cas_user;

  store.getAllForUser(user, function (err, apps) {
    if (err) {
      console.log('error getting applications', err);
      return res.send(500, 'error');
    }

    // find app
    const application = apps[req.params.applicationId];
    if (!application) {
      console.log('could not find application');
      return res.send(404, 'could not find application');
    }

    const lookupKey = function (done) {
      // find key
      let key;

      if (req.params.keyId) {
        key = application.keys[req.params.keyId];
        if (!key) {
          console.log('could not find key');
          return res.send(404, 'could not find key');
        }

        done(key);
      } else {
        // no key was specified, so find the "web console" purpose key and create if necessary
        key = _.find(application.keys, function (key) {
          return key.purpose === 'web console' &&
                 !key.revoked_at &&
                 !moment(key.expires).isBefore(moment());
        });

        if (key) {
          done(key);
        } else {
          store.addKey(application.application_id, {
            user: user,
            expires: moment().add('years', 1).toISOString(),
            purpose: 'web console'
          }, function (err, key) {
            if (err) {
              console.log('error generating web console key:', err);
              return res.send(500, 'error');
            }

            done(key);
          });
        }
      }
    };

    lookupKey(function (key) {
      const expires = req.body.expires && moment(req.body.expires) || moment().add('hours', 1);

      const payload = {
        keyId: key.key_id,
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
    });
  });
};
