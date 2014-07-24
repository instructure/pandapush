var faye    = require('faye'),
    redis   = require('faye-redis-sharded'),
    auth    = require('./extensions/auth'),
    metrics = require('./extensions/metrics');


var instance = null;

exports.getClient = function() {
  if (!instance) {
    return;
  }

  return instance.getClient();
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
      shards: redisHosts
    };
  }

  var bayeux = instance = new faye.NodeAdapter(options);

  bayeux.addExtension(auth.sub);
  bayeux.addExtension(auth.pub);

  metrics.setup(bayeux);

  bayeux.attach(server);
};
