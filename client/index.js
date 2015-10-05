var Faye = require('./node_modules/faye/browser/faye-browser.js');

var Client = Faye.Class({
  initialize: function(base) {
    var self = this;
    self._faye = new Faye.Client(base);
    self._tokens = {};
    self._presences = {};
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

          if (self._presences[message.subscription]) {
            if (!message.ext) message.ext = {};
            message.ext.presence = self._presences[message.subscription];
          }
        }

        callback(message);
      },
      incoming: function(message, callback) {
        if (message.channel === '/meta/subscribe') {
          var presenceCB = self._presenceCBs[message.subscription];
          if (presenceCB) {
            if (message.ext && message.ext.presence) {
              presenceCB(message.ext.presence);
            } else {
              presenceCB(message);
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
   * @param presence [Object] (optional)
   * @callback [function(message)]
   *   @param message [Object]
   * @returns {Promise}
   *
   * subscribe(channel, callback)
   * subscribe(channel, token, callback);
   * subscribe(channel, token, presence, callback);
   */
  subscribe: function() {
    var channel = arguments[0];
    var callback = arguments[arguments.length - 1];
    var token, presence = null;
    if (arguments.length >= 3) {
      token = arguments[1];
    }
    if (arguments.length >= 4) {
      presence = arguments[2];
    }
    var self = this;

    if (token) {
      self._tokens[channel] = token;
    }

    if (presence) {
      if (!presence.id) {
        console.error('presence object supplied with no `id` field');
        return null;
      }

      self._presences[channel] = presence;
      self._presenceCBs[channel] = callback;
    }

    return self._faye.subscribe.call(self._faye, channel, callback);
  },

  unsubscribe: function(channel) {
    return this._faye.unsubscribe(channel);
  }
});

module.exports = {
  Client: Client
};
