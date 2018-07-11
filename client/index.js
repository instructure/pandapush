const Faye = require("faye/src/faye_browser");
const Class = require("faye/src/util/class");

const Client = Class(Faye.Client, {
  initialize: function(base, options) {
    Faye.Client.prototype.initialize.call(this, base, options);

    const self = this;
    self._tokens = {};
    self._presenceCBs = {};

    this.addExtension({
      outgoing: function(message, callback) {
        let token;

        if (message.data && message.data._originalData) {
          token = message.data._token;
          message.data = message.data._originalData;
        }

        if (!token) {
          const channel =
            message.channel === "/meta/subscribe"
              ? message.subscription
              : message.channel;
          token = self._tokens[channel];
        }

        if (token) {
          if (typeof token === "function") {
            token = token();
          }

          if (!message.ext) message.ext = {};
          message.ext.auth = {
            token: token
          };
        }

        callback(message);
      },
      incoming: function(message, callback) {
        if (
          message.channel === "/meta/subscribe" &&
          message.ext &&
          message.ext.presence
        ) {
          const presenceCB = self._presenceCBs[message.subscription];
          if (presenceCB) {
            presenceCB(message.ext.presence, message.subscription);
          }
        }
        callback(message);
      }
    });
  },

  /**
   * @param channel [String]
   * @param token [String, Function] Either a string, or a function that will return a string.
   *   Can be useful for specifying new tokens without needing to resubscribe.
   * @callback [function(message, channel)]
   *   @param message [Object]
   *   @param channel [String]
   * @returns {Promise}
   *
   * subscribeTo(channel, token, callback);
   */
  subscribeTo: function(channel, token, callback) {
    if (token) {
      this._tokens[channel] = token;
    }

    this._presenceCBs[channel] = callback;

    return this.subscribe(channel).withChannel(function(channel, message) {
      if (callback) {
        callback(message, channel);
      }
    });
  },

  /**
   * @param channel [String]
   * @param token [String]
   * @param message [Object]
   * @returns {Promise}
   */
  publishTo: function(channel, token, data) {
    const wrappedData = {
      _originalData: data,
      _token: token
    };

    return this.publish(channel, wrappedData);
  }
});

module.exports = {
  Client: Client
};
