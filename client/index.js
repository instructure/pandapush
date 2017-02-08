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
        if (message.channel === '/meta/subscribe') {
          if (self._tokens[message.subscription]) {
            if (!message.ext) message.ext = {};
            message.ext.auth = {
              token: self._tokens[message.subscription]
            };
          }
        }

        callback(message);
      },
      incoming: function(message, callback) {
        if (message.channel === '/meta/subscribe') {
          if (message.ext && message.ext.presence) {
            var presenceCB = self._presenceCBs[message.subscription];
            if (presenceCB) {
              presenceCB(message.ext.presence);
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
   * @callback [function(message)]
   *   @param message [Object]
   * @returns {Promise}
   *
   * subscribe(channel, callback)
   * subscribe(channel, token, callback);
   */
  subscribe: function() {
    var channel = arguments[0];
    var callback = arguments[arguments.length - 1];
    var token = null;
    if (arguments.length >= 3) {
      token = arguments[1];
    }
    var self = this;

    if (token) {
      self._tokens[channel] = token;
    }

    self._presenceCBs[channel] = callback;

    return self._faye.subscribe.call(self._faye, channel, callback);
  },

  unsubscribe: function(channel) {
    return this._faye.unsubscribe(channel);
  }
});

module.exports = {
  Client: Client
};
