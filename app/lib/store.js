var path   = require('path'),
    mkdirp = require('mkdirp'),
    fs     = require('fs'),
    _      = require('lodash');

var rootAdmins = process.env.ROOT_ADMINS && process.env.ROOT_ADMINS.split(',') || [];

var store = null;

exports.get            = function() { store.get.apply(store, arguments); };
exports.getById        = function() { store.getById.apply(store, arguments); };
exports.addApplication = function() { store.addApplication.apply(store, arguments); };
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

    if (!_.contains(rootAdmins, userId)) {
      applications = _.pick(applications, function(app) {
        return _.contains(app.admins, userId);
      });
    }

    done(null, applications);
  });
};

exports.init = function(done) {
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
        !process.env.DYNAMO_TABLE_APPLICATIONS ||
        !process.env.DYNAMO_TABLE_KEYS) {
      throw "missing aws/dynamo configuration - AWS_REGION, DYNAMO_TABLE_APPLICATIONS, DYNAMO_TABLE_KEYS required";
    }

    store = require('./stores/dynamo')({
      applications: process.env.DYNAMO_TABLE_APPLICATIONS,
      keys:         process.env.DYNAMO_TABLE_KEYS
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
