var fs     = require('fs'),
    _      = require('lodash'),
    moment = require('moment'),
    token  = require('../token');

module.exports = function(dbpath) {
  var database = {};

  var readDatabase = function(done) {
    fs.readFile(dbpath, function(err, data) {
      if (err) {
        console.log("error reading database: ", err);
        done(err);
        return;
      }

      var db = JSON.parse(data);
      // fix some old bad databases
      delete db.applications;
      done(null, db);
    });
  };

  var writeDatabase = function(db, done) {
    fs.writeFile(dbpath, JSON.stringify(db), function(err, data) {
      if (err) {
        console.log("error writing database: ", err);
        done(err);
        return;
      }

      done();
    });
  };

  if (fs.existsSync(dbpath)) {
    readDatabase(function(err, db) {
      if (err) {
        throw "error loading database initially: " + err;
      }

      database = db;
    });
  }
  else {
    writeDatabase(database, function(err) {
    });
  }

  return {
    get: function(done) {
      _.defer(done, null, database);
    },

    getById: function(id, done) {
      _.defer(done, null, database[id]);
    },

    addApplication: function(attributes, done) {
      token.generate(20, function(id) {
        database[id] = {
          application_id: id,
          name:           attributes.name,
          created_at:     moment().toISOString(),
          created_by:     attributes.user,
          admins:         attributes.admins
        };

        writeDatabase(database, function(err) {
          if (err) {
            console.log("error writing database: ", err);
            done(err);
            return;
          }

          done(null, id);
        });
      });
    },

    addKey: function(applicationId, attributes, done) {
      var expiresAt = moment(attributes.expires);
      if (!expiresAt.isValid()) {
        done("expires is not a valid date", null);
        return;
      }

      token.generate(16, function(keyId) {
        keyId = 'PSID' + keyId;
        token.generate(40, function(keySecret) {
          if (!database[applicationId].keys) {
            database[applicationId].keys = {};
          }

          database[applicationId].keys[keyId] = {
            application_id: applicationId,
            key_id:         keyId,
            secret:         keySecret,
            created_at:     moment().toISOString(),
            created_by:     attributes.user,
            expires:        expiresAt.toISOString(),
            purpose:        attributes.purpose
          };

          writeDatabase(database, function(err) {
            if (err) {
              console.log("error writing database:", err);
              done(err);
              return;
            }

            done(null, {
              key_id: keyId,
              secret: keySecret,
              expires: expiresAt.toISOString()
            });
          });
        });
      });
    },

    revokeKey: function(applicationId, keyId, done) {
      database[applicationId].keys[keyId].revoked_at = moment().toISOString();

      writeDatabase(database, function(err) {
        if (err) {
          console.log("error writing database:", err);
          done(err);
          return;
        }

        done();
      });
    }
  };
};


