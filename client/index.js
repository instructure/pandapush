var Faye = require('faye/src/faye_browser');
var Class = require('faye/src/util/class');

var Client = Class({
  initialize: function(base) {
    var self = this;
    self._faye = new Faye.Client(base);
    self._tokens = {};
    self._presenceCBs = {};

    self._faye.addExtension({
      outgoing: function(message, callback) {
        const channel = message.channel === '/meta/subscribe' ?
                          message.subscription :
                          message.channel;
        const token = self._tokens[channel];

        if (token) {
          if (!message.ext) message.ext = {};
          message.ext.auth = {
            token: token
          };
        }

        callback(message);
      },
      incoming: function(message, callback) {
        if (message.channel === '/meta/subscribe') {
          if (message.ext && message.ext.presence) {
            var presenceCB = self._presenceCBs[message.subscription];
            if (presenceCB) {
              presenceCB(message.ext.presence, message.subscription);
            }
          }
        }
        callback(message);
      }
    });
  },

  addExtension: function(extension) {
    return this._faye.addExtension(extension);
  },

  /**
   * @param channel [String]
   * @param token [String] (optional)
   * @callback [function(message, channel)] (optional)
   *   @param message [Object]
   *   @param channel [String]
   * @returns {Promise}
   *
   * subscribe(channel, callback)
   * subscribe(channel, token, callback);
   */
  subscribe: function() {
    var channel = arguments[0];
    var callback = null;
    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    }
    var token = null;
    if (typeof arguments[1] === 'string') {
      token = arguments[1];
    }
    var self = this;

    if (token) {
      self._tokens[channel] = token;
    }

    self._presenceCBs[channel] = callback;

    if (callback) {
      return self._faye.subscribe.call(self._faye, channel).withChannel(function(channel, message) {
        callback(message, channel);
      });
    } else {
      return self._faye.subscribe.call(self._faye, channel);
    }
  },

  /**
   * @param channel [String]
   * @param token [String]
   * @param message [Object]
   * @returns {Promise}
   */
  publish: function(channel, token, message) {
    var self = this;

    if (token) {
      self._tokens[channel] = token;
    }

    return self._faye.publish.call(self._faye, channel, message);
  },

  unsubscribe: function(channel) {
    return this._faye.unsubscribe(channel);
  }
});

module.exports = {
  Client: Client
};
