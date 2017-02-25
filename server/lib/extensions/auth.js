const jwt = require('jsonwebtoken');
const channels = require('../channels');
const store = require('../store');
const _ = require('lodash');
const moment = require('moment');

const error = function (message, callback, error) {
  message.error = error;
  callback(message);
  return;
};

const verifyAuth = function (channel, auth, allowPublic, done) {
  const appKeyInfo = {};
  const channelInfo = channels.parse(channel);
  if (!channelInfo) {
    return done('Invalid channel name');
  }

  appKeyInfo.applicationId = channelInfo.applicationId;

  if (allowPublic && channelInfo.public) {
    // public means no auth necessary...
    return done(null, appKeyInfo);
  }

  if (!auth) {
    return done('No auth supplied');
  }

  let keyId;

  if (auth.token) {
    const tokenContents = jwt.decode(auth.token);
    if (!tokenContents || !tokenContents.keyId) {
      return done('Invalid token');
    }

    keyId = tokenContents.keyId;
  } else if (auth.key) {
    keyId = auth.key;
  } else {
    return done('Auth information does not include token or key');
  }

  appKeyInfo.keyId = keyId;
  const key = store.getKeyCachedSync(channelInfo.applicationId, keyId);

  if (!key) {
    return done('Could not find key');
  }

  if (auth.key) {
    if (auth.secret !== key.secret) {
      return done('Invalid secret');
    }

    if (moment(key.expires).isBefore(moment())) {
      return done('Expired key');
    }

    if (key.revoked_at) {
      return done('Revoked key');
    }

    done(null, appKeyInfo);
  } else {
    jwt.verify(auth.token, key.secret, {}, function (err, decoded) {
      if (err || !decoded) {
        return done('Invalid token provided');
      }

      appKeyInfo.decodedToken = decoded;

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
          return done(null, appKeyInfo);
        }

        if (_.endsWith(decoded.channel, '/**') && _.startsWith(channel, decoded.channel.slice(0, -3))) {
          return done(null, appKeyInfo);
        }

        return done('Token does not match channel');
      }

      done(null, appKeyInfo);
    });
  }
};

const checks = {
  '/meta/subscribe': function (message, callback) {
    const msgError = _.partial(error, message, callback);

    const subscription = message.subscription;
    const auth = message.ext && message.ext.auth;

    verifyAuth(subscription, auth, true, function (err, appKeyInfo) {
      if (err) {
        return msgError(err);
      }

      if (appKeyInfo && appKeyInfo.decodedToken && appKeyInfo.decodedToken.sub !== true) {
        return msgError('Token does not allow subscribing');
      }

      message.__internal = appKeyInfo;

      // For presence, overwrite anything the user sent in as presence
      // info in ext with what is in the token.
      if (message.ext) {
        message.ext.presence = null;

        if (appKeyInfo && appKeyInfo.decodedToken) {
          message.ext.presence = appKeyInfo.decodedToken.presence;
        }
      }

      // token verified
      callback(message);
    });
  },

  publish: function (message, callback) {
    const msgError = _.partial(error, message, callback);

    const auth = (message.ext && message.ext.auth) ||
                 (message.data && message.data.__auth);

    verifyAuth(message.channel, auth, false, function (err, appKeyInfo) {
      if (err) {
        return msgError(err, callback);
      }

      if (appKeyInfo && appKeyInfo.decodedToken && appKeyInfo.decodedToken.pub !== true) {
        return msgError('Token does not allow publishing', callback);
      }

      message.__internal = appKeyInfo;

      // token verified
      callback(message);
    });
  }
};

module.exports = function (internalToken) {
  return {
    incoming: function (message, callback) {
      // allow any operations specifying the correct internalToken
      if (message.ext && message.ext.internalToken === internalToken) {
        return callback(message);
      }

      // This field should never be set by clients.
      delete message.__internal;

      if (message.channel.indexOf('/meta/') === 0) {
        const check = checks[message.channel];
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

    outgoing: function (message, callback) {
      // strip out any auth token
      if (message.ext) {
        delete message.ext.auth;
      }

      delete message.__internal;

      if (message.data) {
        delete message.data.__auth;
      }

      callback(message);
    }
  };
};
