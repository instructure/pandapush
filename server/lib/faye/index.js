const Faye = require('faye');
const redis = require('faye-redis-sharded');
const presence = require('faye-presence');
const crypto = require('crypto');
const auth = require('../extensions/auth');
const metrics = require('../extensions/metrics');
const redisConfig = require('./redis_config');
const internalClient = require('./internal_client');

module.exports = function (server) {
  // The internal token is used by a client used internally to send messages
  // to /meta/internal/ channels. All messages flow through the normal auth
  // mechanisms, and a bearer of the internalToken is automatically approved.
  // The token is only needed within the process, as all auth will be
  // handled in-process too.
  const internalToken = crypto.randomBytes(256).toString('base64');

  const redisHosts = redisConfig(process.env);

  const options = {
    mount: '/push',
    timeout: 60,
    engine: {
      type: redis,
      shards: redisHosts[1],
      redisOptions: {
        no_ready_check: true,
        parser: 'javascript',
        handleErrors: true
      }
    }
  };

  const faye = new Faye.NodeAdapter(options);

  faye.addExtension(auth(internalToken));

  const external = faye.getClient();
  const internal = internalClient(internalToken, faye._server);

  presence.setup(faye, internalClient, {
    channelRe: /^\/\w+\/presence\//,
    servers: redisHosts[0]
  });

  metrics(faye).start();

  faye.attach(server);

  return {
    client: external,
    internalClient: internal
  };
};
