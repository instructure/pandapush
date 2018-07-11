const Faye = require("faye");

module.exports = function(internalToken, server) {
  const client = new Faye.Client(server);
  client.addExtension({
    outgoing: function(message, callback) {
      message.ext = message.ext || {};
      message.ext.internalToken = internalToken;
      callback(message);
    }
  });
  return client;
};
