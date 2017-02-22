const statsd = require('./statsd');
const _ = require('lodash');

const interval = process.env.CONNECTIONS_STATS_INTERVAL || 5000;

module.exports = function (http, log, client) {
  let connections = 0;
  let wsConnections = 0;

  http.on('connection', function (socket) {
    connections += 1;

    socket.on('close', function () {
      connections -= 1;
    });
  });

  http.on('upgrade', function (request, socket) {
    wsConnections += 1;

    socket.on('close', function () {
      wsConnections -= 1;
    });
  });

  const sourceId = process.env.HOSTNAME + '-' + process.pid;

  // periodically send to the number of open connections to all servers
  function sendStats () {
    client.publish('/internal/meta/statistics', {
      source: sourceId,
      stats: {
        connections: connections,
        wsConnections: wsConnections
      }
    });
  }

  // collect all the responses from all clients for the interval * 2, aggregate
  // them, and send to statsd. (yes, this will result in duplicate information
  // to statsd, but that's fine because it's a gauge)
  let stats = {};
  let subscription;

  function resubscribe () {
    if (subscription) {
      subscription.cancel();
      subscription = null;
    }

    subscription = client.subscribe('/internal/meta/statistics', function (data) {
      stats[data.source] = data.stats;
    });
  }
  resubscribe();

  function sendStatsToStatsd () {
    if (_.size(stats) === 0) {
      log.info('Did not receive any http stats - resubscribing.');
      resubscribe();
      return;
    }

    let totalConnections = 0;
    let totalWsConnections = 0;

    _.each(_.values(stats), function (stat) {
      totalConnections += stat.connections;
      totalWsConnections += stat.wsConnections;
    });

    log.info('local_http=' + connections +
             ' local_ws=' + wsConnections +
             ' http=' + totalConnections +
             ' ws=' + totalWsConnections);

    if (totalConnections > 0) {
      statsd.gauge('connections.http', totalConnections);
    }

    if (totalWsConnections > 0) {
      statsd.gauge('connections.ws', totalWsConnections);
    }

    stats = {};
  }

  return {
    start: () => {
      setInterval(sendStats, interval);
      setInterval(sendStatsToStatsd, interval * 2);
    },

    sendStats: sendStats,
    sendStatsToStatsd: sendStatsToStatsd
  };
};
