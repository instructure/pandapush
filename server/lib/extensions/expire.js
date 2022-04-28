const redis = require("redis");

module.exports = async function(redisConfigs) {
  return {
    incoming: async function(message, callback) {
      if (message.channel.match(/^\/\w+\/presence\//)) {
        redisConfigs.forEach(async el => {
          const client = redis.createClient(el.port, el.host);
          await client.expire(message.channel, 60 * 60 * 24 * 31 * 6);
          await client.quit();
        });
      }
      callback(message);
    }
  };
};
