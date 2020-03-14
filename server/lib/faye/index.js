const Faye = require("faye");
const redis = require("faye-redis-sharded");
const presence = require("faye-presence");
const crypto = require("crypto");
const auth = require("../extensions/auth");
const metrics = require("../extensions/metrics");
const keyTrackerExtension = require("../extensions/key_tracker");
const keyTracker = require("../key_tracker");
const redisConfig = require("./redis_config");
const internalClient = require("./internal_client");

module.exports = function(server) {
  // The internal token is used by a client used internally to send messages
  // to /meta/internal/ channels. All messages flow through the normal auth
  // mechanisms, and a bearer of the internalToken is automatically approved.
  // The token is only needed within the process, as all auth will be
  // handled in-process too.
  const internalToken = crypto.randomBytes(256).toString("base64");

  const redisHosts = redisConfig(process.env);

  const options = {
    mount: "/push",
    timeout: 30,
    engine: {
      type: redis,
      shards: redisHosts[1],
      redisOptions: {
        no_ready_check: true,
        parser: "javascript",
        handleErrors: true
      }
    }
  };

  const faye = new Faye.NodeAdapter(options);

  faye.addExtension(auth(internalToken));

  // This must be added after the auth extension.
  const tracker = keyTracker();
  tracker.start();
  faye.addExtension(keyTrackerExtension(tracker));

  const external = faye.getClient();
  const internal = internalClient(internalToken, faye._server);

  presence.setup(faye, internal, {
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
