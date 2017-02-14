const Faye = require('faye/src/faye_browser');
const Class = require('faye/src/util/class');

const Client = Class({
  initialize: function (base) {
    const self = this;
    self._faye = new Faye.Client(base);
    self._tokens = {};
    self._presenceCBs = {};

    self._faye.addExtension({
      outgoing: function (message, callback) {
        let token;

        if (message.data._originalData) {
          token = message.data._token;
          message.data = message.data._originalData;
        }

        if (!token) {
          const channel = (message.channel === '/meta/subscribe'
            ? message.subscription
            : message.channel);
          token = self._tokens[channel];
        }

        if (token) {
          if (!message.ext) message.ext = {};
          message.ext.auth = {
            token: token
          };
        }

        callback(message);
      },
      incoming: function (message, callback) {
        if (message.channel === '/meta/subscribe') {
          if (message.ext && message.ext.presence) {
            const presenceCB = self._presenceCBs[message.subscription];
            if (presenceCB) {
              presenceCB(message.ext.presence, message.subscription);
            }
          }
        }
        callback(message);
      }
    });
  },

  addExtension: function (extension) {
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
  subscribe: function () {
    const channel = arguments[0];
    let callback;
    if (typeof arguments[arguments.length - 1] === 'function') {
      callback = arguments[arguments.length - 1];
    }
    let token;
    if (typeof arguments[1] === 'string') {
      token = arguments[1];
    }

    if (token) {
      this._tokens[channel] = token;
    }

    this._presenceCBs[channel] = callback;

    if (callback) {
      return this._faye.subscribe(channel).withChannel(function (channel, message) {
        callback(message, channel);
      });
    } else {
      return this._faye.subscribe(channel);
    }
  },

  /**
   * @param channel [String]
   * @param token [String]
   * @param message [Object]
   * @returns {Promise}
   */
  publish: function (channel, token, data) {
    const wrappedData = {
      _originalData: data,
      _token: token
    };

    return self._faye.publish(channel, wrappedData);
  },

  unsubscribe: function (channel) {
    return this._faye.unsubscribe(channel);
  }
});

module.exports = {
  Client: Client
};
