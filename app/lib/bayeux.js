var Faye     = require('faye'),
    redis    = require('faye-redis-sharded'),
    crypto   = require('crypto'),
    auth     = require('./extensions/auth'),
    metrics  = require('./extensions/metrics'),
    presence = require('faye-presence');


var instance = null,
    externalClient = null,
    internalClient = null;

var internalToken = crypto.randomBytes(256).toString('base64');

exports.getClient = function() {
  return externalClient;
};

exports.getInternalClient = function() {
  return internalClient;
};

exports.attach = function(server) {
  var redisHosts = [];
  if (process.env.REDIS_HOSTS) {
    redisHosts = process.env.REDIS_HOSTS.split(',').map(function(hostAndPort) {
      var ary = hostAndPort.split(':'),
          host = ary[0],
          port = ary[1];

      return { host: host, port: port };
    });
  }

  var options = {
    mount: '/push',
    timeout: 60
  };

  if (redisHosts.length > 0) {
    options.engine = {
      type: redis,
      shards: redisHosts,
      redisOptions: {
        no_ready_check: true,
        parser:'javascript',
        handleErrors: true
      }
    };
  }

  var bayeux = instance = new Faye.NodeAdapter(options);

  bayeux.addExtension(auth(internalToken));

  externalClient = bayeux.getClient();

  internalClient = new Faye.Client(bayeux._server);
  internalClient.addExtension({
    outgoing: function(message, callback) {
      message.ext = message.ext || {};
      message.ext.internalToken = internalToken;
      callback(message);
    }
  });

  presence.setup(bayeux, internalClient, {
    channelRe: /^\/\w+\/presence\//,
    servers: process.env.REDIS_HOSTS.split(',')
  });

  metrics.setup(bayeux, internalClient);

  bayeux.attach(server);
};
