var path   = require('path'),
    mkdirp = require('mkdirp'),
    fs     = require('fs'),
    _      = require('lodash');

var rootAdmins = process.env.ROOT_ADMINS && process.env.ROOT_ADMINS.split(',') || [];

var store = null;
var dataMutated = null;

exports.get            = function() { store.get.apply(store, arguments); };
exports.getById        = function() { store.getById.apply(store, arguments); };

exports.addApplication = function(attributes, done) {
  store.addApplication(attributes, function(err, res) {

    done(err, res);
  });
};

exports.addKey         = function() { store.addKey.apply(store, arguments); };
exports.revokeKey      = function() { store.revokeKey.apply(store, arguments); };

var cache = {};
exports.getCached = function(done) {
  _.defer(done, null, cache);
};

exports.getByIdCached = function(applicationId, done) {
  _.defer(done, null, cache[applicationId]);
};

exports.getAllForUser = function(userId, done) {
  exports.get(function(err, applications) {
    if (err) {
      done(err);
      return;
    }

    if (_.indexOf(rootAdmins, userId) < 0) {
      applications = _.filter(applications, function(app) {
        return _.indexOf(app.admins, userId) >= 0;
      });
    }

    done(null, applications);
  });
};

exports.init = function(bayeux, done) {
  setInterval(function() {
    exports.get(function(err, applications) {
      cache = applications;
    });
  }, 5000);

  if (process.env.DATA_STORE == "FILE") {
    var dbdir = path.resolve(__dirname, '../../localdata');
    if (!fs.existsSync(dbdir)) {
      mkdirp.sync(dbdir);
    }

    store = require('./stores/file')(dbdir + '/db.json');
  }
  else if (process.env.DATA_STORE == "DYNAMO") {
    if (!process.env.AWS_REGION ||
        !process.env.DYNAMO_APPLICATIONS ||
        !process.env.DYNAMO_KEYS) {
      throw "missing aws/dynamo configuration - AWS_REGION, DYNAMO_APPLICATIONS, DYNAMO_KEYS required";
    }

    store = require('./stores/dynamo')({
      applications: process.env.DYNAMO_APPLICATIONS,
      keys:         process.env.DYNAMO_KEYS
    });
  }
  else {
    throw "unknown DATA_STORE specified: " + process.env.DATA_STORE;
  }

  exports.get(function(err, applications) {
    cache = applications;
    done();
  });
}
