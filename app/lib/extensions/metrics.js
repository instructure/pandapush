var channels = require('../channels'),
    statsd   = require('../statsd'),
    _        = require('lodash');

exports.setup = function(bayeux, client) {
  // We're keeping lookup tables of connected clients. This will take
  // some RAM, but given we probably won't ever have > 50k users connected
  // to a single app server anyway, it shouldn't matter. We're optimizing
  // for speed of lookup here.

  // Quick access to all the apps/channels a client is connected to.
  // { clientId: { appId: { channel: time } } }
  var clients = {};

  // Quick access to all the clients connected to an app.
  // (Being connected to an app means you are connected to at least one
  // channel in the application.)
  // { appId: { clientId: time } }
  var appClients = {};

  // Quick access to all clients connected to a channel in an app.
  // { appId: { channel: { clientId: time } } }
  var  appChannelClients = {};


  // How many publishes went to each app+channel in the last cycle.
  // { appId: { channel: count } }
  var publishCounts = {};


  bayeux.on('handshake', function(clientId) {
    clients[clientId] = clients[clientId] || {};
  });

  bayeux.on('disconnect', function(clientId) {
    if (clients[clientId]) {
      _.forEach(_.keys(clients[clientId]), function(appId) {
        if (appClients[appId] &&
            appClients[appId][clientId]) {
          delete appClients[appId][clientId];
        }

        _.forEach(_.keys(clients[clientId][appId]), function(channel) {
          if (appChannelClients[appId] &&
              appChannelClients[appId][channel] &&
              appChannelClients[appId][channel][clientId]) {
            delete appChannelClients[appId][channel][clientId];
          }
        });
      });

      delete clients[clientId];
    }
  });

  var getAppId = function(channel) {
    var channelInfo = channels.parse(channel);
    if (!channelInfo) {
      console.log("unknown channel: " + channel);
      return;
    }

    // don't do anything with meta channels
    if (channelInfo.meta) {
      return;
    }

    return channelInfo.applicationId;
  };

  bayeux.on('subscribe', function(clientId, channel) {
    var appId = getAppId(channel);
    if (!appId) return;

    clients[clientId] = clients[clientId] || {};
    clients[clientId][appId] = Date.now();

    appClients[appId] = appClients[appId] || {};
    appClients[appId][clientId] = Date.now();
  });

  bayeux.on('unsubscribe', function(clientId, channel) {
    var appId = getAppId(channel);
    if (!appId) return;

    if (appChannelClients[appId] &&
        appChannelClients[appId][channel] &&
        appChannelClients[appId][channel][clientId]) {
      delete appChannelClients[appId][channel][clientId];

      if (_.isEmpty(appChannelClients[appId][channel])) {
        delete appChannelClients[appId][channel];
      }

      if (_.isEmpty(appChannelClients[appId])) {
        delete appChannelClients[appId];
      }
    }

    // remove this channel from the subscribed list for the application,
    // and if it was the last one in the application, also remove
    // the client from the application.
    if (clients[clientId] &&
        clients[clientId][appId] &&
        clients[clientId][appId][channel]) {
      delete clients[clientId][appId][channel];

      if (_.isEmpty(clients[clientId][appId])) {
        delete clients[clientId][appId];

        if (appClients[appId] &&
            appClients[appId][clientId]) {
          delete appClients[appId][clientId];
        }

        if (_.isEmpty(appClients[appId])) {
          delete appClients[appId];
        }
      }
    }
  });

  bayeux.on('publish', function(clientId, channel, data) {
    var appId = getAppId(channel);
    if (!appId) return;

    publishCounts[appId] = publishCounts[appId] || {};
    publishCounts[appId][channel] = publishCounts[appId][channel] || 0;
    publishCounts[appId][channel] += 1;
  });

  var pushToStatsd = function(stats) {
    statsd.gauge('connected_clients', stats.clients);

    _.each(stats.applications, function(appStats, appId) {
      var prefix = 'apps.' + appId;

      if (appStats.publishes) {
        statsd.increment(prefix + '.publishes', appStats.publishes);
      }
      statsd.gauge(prefix + '.published_channels', appStats.publishedChannels);
      statsd.gauge(prefix + '.clients', appStats.clients);
      statsd.gauge(prefix + '.channels', appStats.channels);
    });
  };

  var pushToClients = function(stats) {
    _.each(stats.applications, function(appStats, appId) {
      client.publish('/' + appId + '/meta/statistics', {
        source: process.env.HOSTNAME,
        stats: appStats
      })
    });
  };

  var updateStatistics = function() {
    var stats = {
      applications: {},
      clients: _.keys(clients).length
    };

    // add per-application publish counts
    _.each(publishCounts, function(channelCounts, appId) {
      var appPublishCount = _.reduce(channelCounts, function(sum, count) { return sum + count; }, 0);
      stats.applications[appId] = {
        publishes: appPublishCount,
        publishedChannels: _.keys(channelCounts).length
      };
    });

    // add per-application subscriptions
    _.each(appClients, function(clients, appId) {
      stats.applications[appId] = stats.applications[appId] || {};
      stats.applications[appId].clients = _.keys(clients).length;

      if (appChannelClients[appId]) {
        var channelClients = appChannelClients[appId];
        stats.applications[appId].channels = _.keys(channelClients).length;
      }
    });

    // reset the publish counters
    publishCounts = {};

    pushToStatsd(stats);
    pushToClients(stats);
  };

  setInterval(updateStatistics, 5000);
};

