module.exports = function (tracker) {
  return {
    incoming: function (message, callback) {
      const info = message.__internal;

      if (info) {
        tracker.record(info.applicationId, info.keyId);
      }

      callback(message);
    }
  };
};
