const channels = require("../channels");
const statsd = require("../statsd");
const _ = require("lodash");

module.exports = function(faye) {
  let stats, appStats;

  function resetStats() {
    stats = {
      handshake: 0,
      close: 0,
      disconnect: 0,
      subscribe: 0,
      unsubscribe: 0,
      publish: 0
    };

    appStats = {
      // { appId: count }
      subscribe: {},
      unsubscribe: {},
      publish: {}
    };
  }

  resetStats();

  faye.on("handshake", function(clientId) {
    stats.handshake += 1;
  });

  faye.on("close", function(clientId) {
    stats.close += 1;
  });

  faye.on("disconnect", function(clientId) {
    stats.disconnect += 1;
  });

  function getAppId(channel) {
    const channelInfo = channels.parse(channel);
    if (!channelInfo) {
      console.log("unknown channel: " + channel);
      return;
    }

    // don't do anything with meta channels
    if (channelInfo.meta) {
      return;
    }

    return channelInfo.applicationId;
  }

  function incrementAppMetric(metric, channel) {
    const appId = getAppId(channel);

    if (appId) {
      metric[appId] = metric[appId] || 0;
      metric[appId] += 1;
    }
  }

  faye.on("subscribe", function(clientId, channel) {
    stats.subscribe += 1;
    incrementAppMetric(appStats.subscribe, channel);
  });

  faye.on("unsubscribe", function(clientId, channel) {
    stats.unsubscribe += 1;
    incrementAppMetric(appStats.unsubscribe, channel);
  });

  faye.on("publish", function(clientId, channel, data) {
    stats.publish += 1;
    incrementAppMetric(appStats.publish, channel);
  });

  const pushToStatsd = function(stats, appStats) {
    _.each(stats, function(count, stat) {
      if (count > 0) {
        statsd.count(stat, count);
      }
    });

    _.each(appStats, function(appCounts, stat) {
      _.each(appCounts, function(count, appId) {
        if (count > 0) {
          statsd.count("apps." + appId + "." + stat, count);
        }
      });
    });
  };

  const flushStatistics = () => {
    pushToStatsd(stats, appStats);
    resetStats();
  };

  return {
    start: () => {
      setInterval(flushStatistics, 5000);
    },
    flush: flushStatistics
  };
};
