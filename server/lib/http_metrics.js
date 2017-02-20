const statsd = require('./statsd');
const bayeux = require('./bayeux');
const _ = require('lodash');

const interval = process.env.CONNECTIONS_STATS_INTERVAL || 5000;

module.exports = function (http, log) {
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
    bayeux.getInternalClient().publish('/internal/meta/statistics', {
      source: sourceId,
      stats: {
        connections: connections,
        wsConnections: wsConnections
      }
    });
  }
  setInterval(sendStats, interval);

  // collect all the responses from all clients for the interval * 2, aggregate
  // them, and send to statsd. (yes, this will result in duplicate information
  // to statsd, but that's fine because it's a gauge)
  let stats = {};
  bayeux.getInternalClient().subscribe('/internal/meta/statistics', function (data) {
    stats[data.source] = data.stats;
  });

  function sendStatsToStatsd () {
    let totalConnections = 0;
    let totalWsConnections = 0;

    _.each(_.values(stats), function (stat) {
      totalConnections += stat.connections;
      totalWsConnections += stat.wsConnections;
    });

    log.info('local_http=' + stats[sourceId].connections +
             ' local_ws=' + stats[sourceId].wsConnections +
             ' http=' + totalConnections +
             ' ws=' + totalWsConnections);

    statsd.gauge('connections.http', totalConnections);
    statsd.gauge('connections.ws', totalWsConnections);
    stats = {};
  }
  setInterval(sendStatsToStatsd, interval * 2);
};
