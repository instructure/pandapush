var jwt          = require('jsonwebtoken'),
    channels     = require('../channels'),
    store        = require('../store'),
    _            = require('lodash'),
    moment       = require('moment');

var error = function(message, callback, error) {
  message.error = error;
  callback(message);
  return;
};

var verifyAuth = function(channel, auth, allowPublic, done) {
  var channelInfo = channels.parse(channel);
  if (!channelInfo) {
    return done('Invalid channel name');
  }

  store.getByIdCached(channelInfo.applicationId, function(err, application) {
    if (err) {
      return done('Error loading application');
    }

    if (!application) {
      return done('Could not find application');
    }

    if (allowPublic && channelInfo.public) {
      // public means no auth necessary...
      return done(null, null);
    }

    if (!auth) {
      return done('No auth supplied');
    }

    var keyId = null;

    if (auth.token) {
      var tokenContents = jwt.decode(auth.token);
      if (!tokenContents || !tokenContents.keyId) {
        return done('Invalid token');
      }

      keyId = tokenContents.keyId;
    }
    else if (auth.key) {
      keyId = auth.key;
    }
    else {
      return done('Auth information does not include token or key');
    }

    var key = application.keys[keyId];

    if (!key) {
      return done('Could not find key');
    }

    if (auth.key) {
      if (auth.secret != key.secret) {
        return done('Invalid secret');
      }

      if (moment(key.expires).isBefore(moment())) {
        return done('Expired key');
      }

      if (key.revoked_at) {
        return done('Revoked key');
      }

      done(null);
    }
    else {
      jwt.verify(auth.token, key.secret, {}, function(err, decoded) {
        if (err || !decoded) {
          return done('Invalid token provided');
        }

        if (moment(key.expires).isBefore(moment())) {
          return done('Expired key');
        }

        if (key.revoked_at) {
          return done('Revoked key');
        }

        if (channel !== decoded.channel) {
          if (_.endsWith(decoded.channel, '/*') &&
              _.startsWith(channel, decoded.channel.slice(0, -2)) &&
              _.lastIndexOf(channel, '/') === _.lastIndexOf(decoded.channel, '/')) {
            return done(null, decoded);
          }

          if (_.endsWith(decoded.channel, '/**') && _.startsWith(channel, decoded.channel.slice(0, -3))) {
            return done(null, decoded);
          }

          return done('Token does not match channel');
        }

        done(null, decoded);
      });
    }
  });
}

var checks = {
  '/meta/subscribe': function(message, callback) {
    var msgError = _.partial(error, message, callback);

    var subscription = message.subscription,
        auth         = message.ext && message.ext.auth;

    verifyAuth(subscription, auth, true, function(err, decoded) {
      if (err) {
        return msgError(err);
      }

      if (decoded && decoded.sub !== true) {
        return msgError('Token does not allow subscribing');
      }

      // token verified
      callback(message);
    });
  },

  publish: function(message, callback) {
    var msgError = _.partial(error, message, callback);

    var auth = (message.ext && message.ext.auth) ||
               (message.data && message.data.__auth);

    verifyAuth(message.channel, auth, false, function(err, decoded) {
      if (err) {
        return msgError(err, callback);
      }

      if (decoded && decoded.pub !== true) {
        return msgError('Token does not allow publishing', callback);
      }

      // token verified
      callback(message);
    });
  }
};

module.exports = function(internalToken) {
  return {
    incoming: function(message, callback) {

      // allow any operations specifying the correct internalToken
      if (message.ext && message.ext.internalToken == internalToken) {
        return callback(message);
      }

      if (message.channel.indexOf('/meta/') === 0) {
        var check = checks[message.channel];
        if (check) {
          check(message, callback);
          return;
        }

        // no authentication specified for this meta channel
        callback(message);
        return;
      }

      checks.publish(message, callback);
      return;
    },

    outgoing: function(message, callback) {
      // strip out any auth token
      if (message.ext) {
        delete message.ext.auth;
      }

      if (message.data) {
        delete message.data.__auth;
      }

      callback(message);
    }
  };
};
