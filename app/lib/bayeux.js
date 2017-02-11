var Faye     = require('faye'),
    redis    = require('faye-redis-sharded'),
    crypto   = require('crypto'),
    auth     = require('./extensions/auth'),
    metrics  = require('./extensions/metrics'),
    presence = require('faye-presence'),
    parseUrl = require('url').parse;


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
  var redisHostList = [];

  if (process.env.REDIS_HOSTS) {
    redisHostList = process.env.REDIS_HOSTS.split(',');
  } else if (process.env.REDIS_URL_ENV_VARS) {
    redisHostList = process.env.REDIS_URL_ENV_VARS.split(',').map(function(envVar) {
      var url = process.env[envVar];
      var parsedUrl = parseUrl(url);
      return parsedUrl.host; // this is host:port, which is what we want in the array
    });
  }

  var redisHosts = [];
  if (redisHostList) {
    redisHosts = redisHostList.map(function(hostAndPort) {
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
    servers: redisHostList
  });

  metrics.setup(bayeux, internalClient);

  bayeux.attach(server);
};
