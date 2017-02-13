const channels = require('../channels');
const statsd = require('../statsd');
const _ = require('lodash');

exports.setup = function (bayeux, client) {
  let stats, appStats;

  function resetStats () {
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

  bayeux.on('handshake', function (clientId) {
    stats.handshake += 1;
  });

  bayeux.on('close', function (clientId) {
    stats.close += 1;
  });

  bayeux.on('disconnect', function (clientId) {
    stats.disconnect += 1;
  });

  function getAppId (channel) {
    const channelInfo = channels.parse(channel);
    if (!channelInfo) {
      console.log('unknown channel: ' + channel);
      return;
    }

    // don't do anything with meta channels
    if (channelInfo.meta) {
      return;
    }

    return channelInfo.applicationId;
  }

  function incrementAppMetric (metric, channel) {
    const appId = getAppId(channel);

    if (appId) {
      metric[appId] = metric[appId] || 0;
      metric[appId] += 1;
    }
  }

  bayeux.on('subscribe', function (clientId, channel) {
    stats.subscribe += 1;
    incrementAppMetric(appStats.subscribe, channel);
  });

  bayeux.on('unsubscribe', function (clientId, channel) {
    stats.unsubscribe += 1;
    incrementAppMetric(appStats.unsubscribe, channel);
  });

  bayeux.on('publish', function (clientId, channel, data) {
    stats.publish += 1;
    incrementAppMetric(appStats.publish, channel);
  });

  const pushToStatsd = function (stats, appStats) {
    _.each(stats, function (count, stat) {
      statsd.count(stat, count);
    });

    _.each(appStats, function (appCounts, stat) {
      _.each(appCounts, function (count, appId) {
        statsd.count('apps.' + appId + '.' + stat, count);
      });
    });
  };

  const pushToClients = function (stats, appStats) {
    // TODO: revisit what stats to push out to clients

    // _.each(stats.applications, function(appStats, appId) {
    //   client.publish('/' + appId + '/meta/statistics', {
    //     source: process.env.HOSTNAME + '-' + process.pid,
    //     stats: appStats
    //   })
    // });
  };

  const updateStatistics = function () {
    pushToStatsd(stats, appStats);
    pushToClients(stats, appStats);

    resetStats();
  };

  setInterval(updateStatistics, 5000);
};

