var Faye    = require('faye'),
    redis   = require('faye-redis-sharded'),
    crypto  = require('crypto'),
    auth    = require('./extensions/auth'),
    metrics = require('./extensions/metrics');


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
    timeout: 300
  };

  if (redisHosts.length > 0) {
    options.engine = {
      type: redis,
      shards: redisHosts
    };
  }

  var bayeux = instance = new Faye.NodeAdapter(options);

  bayeux.addExtension(auth(internalToken));

  metrics.setup(bayeux);

  externalClient = bayeux.getClient();

  internalClient = new Faye.Client(bayeux._server);
  internalClient.addExtension({
    outgoing: function(message, callback) {
      message.ext = message.ext || {};
      message.ext.internalToken = internalToken;
      callback(message);
    }
  });

  bayeux.attach(server);
};
