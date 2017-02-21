const Faye = require('faye');
const redis = require('faye-redis-sharded');
const crypto = require('crypto');
const auth = require('./extensions/auth');
const metrics = require('./extensions/metrics');
const presence = require('faye-presence');
const parseUrl = require('url').parse;

let externalClient, internalClient;

const internalToken = crypto.randomBytes(256).toString('base64');

exports.getClient = function () {
  return externalClient;
};

exports.getInternalClient = function () {
  return internalClient;
};

exports.attach = function (server) {
  // an array of host:port strings
  let redisHostList = [];
  if (process.env.REDIS_HOSTS) {
    redisHostList = process.env.REDIS_HOSTS.split(',');
  } else if (process.env.REDIS_URL_ENV_VARS) {
    redisHostList = process.env.REDIS_URL_ENV_VARS.split(',').map(function (envVar) {
      const url = process.env[envVar];
      const parsedUrl = parseUrl(url);
      return parsedUrl.host; // this is host:port, which is what we want in the array
    });
  }

  // an array of objects with host and port keys
  let redisHosts = [];
  if (redisHostList) {
    redisHosts = redisHostList.map(function (hostAndPort) {
      const ary = hostAndPort.split(':');
      return { host: ary[0], port: ary[1] };
    });
  }

  const options = {
    mount: '/push',
    timeout: 60
  };

  if (redisHosts.length > 0) {
    options.engine = {
      type: redis,
      shards: redisHosts,
      redisOptions: {
        no_ready_check: true,
        parser: 'javascript',
        handleErrors: true
      }
    };
  }

  const bayeux = new Faye.NodeAdapter(options);

  bayeux.addExtension(auth(internalToken));

  externalClient = bayeux.getClient();

  internalClient = new Faye.Client(bayeux._server);
  internalClient.addExtension({
    outgoing: function (message, callback) {
      message.ext = message.ext || {};
      message.ext.internalToken = internalToken;
      callback(message);
    }
  });

  presence.setup(bayeux, internalClient, {
    channelRe: /^\/\w+\/presence\//,
    servers: redisHostList
  });

  metrics(bayeux).start();

  bayeux.attach(server);
};
