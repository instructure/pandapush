const parseUrl = require('url').parse;

// Returns two arrays, the first is an array of host:port strings,
// the second is an array of objects with host and port keys.
module.exports = function (env) {
  const config = env || process.env;

  // an array of host:port strings
  let redisHostList = [];
  if (config.REDIS_HOSTS) {
    redisHostList = config.REDIS_HOSTS.split(',');
  } else if (config.REDIS_URL_ENV_VARS) {
    redisHostList = config.REDIS_URL_ENV_VARS.split(',').map(envVar => {
      const url = config[envVar];
      const parsedUrl = parseUrl(url);
      return parsedUrl.host; // this is host:port, which is what we want in the array
    });
  }

  // an array of objects with host and port keys
  let redisHosts = [];
  redisHosts = redisHostList.map(hostAndPort => {
    const ary = hostAndPort.split(':');
    return { host: ary[0], port: ary[1] };
  });

  return [ redisHostList, redisHosts ];
};
