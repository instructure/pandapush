const store = require('./store');

const KEY_STATS_INTERVAL_MS = process.env.KEY_STATS_INTERVAL_MS || 60000;

module.exports = function () {
  let cache = {};
  let interval;

  const writeStats = function () {
    const lastCache = cache;
    cache = {};

    Promise.all(Object.keys(lastCache).map(key => {
      const values = lastCache[key];
      const c = key.split(':');
      return store.addKeyUsage(c[0], c[1], values.lastUsed, values.count);
    }))
    .catch(err => {
      console.log('error writing key stats', err);
    });
  };

  const record = function (applicationId, keyId) {
    const key = `${applicationId}:${keyId}`;
    cache[key] = cache[key] || { count: 0 };
    cache[key].lastUsed = Date.now();
    cache[key].count += 1;
  };

  return {
    record: record,
    writeStats: writeStats,
    start: function () {
      interval = setInterval(writeStats, KEY_STATS_INTERVAL_MS);
    },
    stop: function () {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }
  };
};
