const bunyan = require('bunyan');

module.exports = function (config) {
  const logStreams = [];
  config = config || process.env;

  if (config.LOG_PATH) {
    logStreams.push({
      level: 'trace',
      type: 'rotating-file',
      path: config.LOG_PATH + '/pandapush.log.json',
      period: '1h',
      count: 24
    });
  } else {
    logStreams.push({
      level: 'trace',
      stream: process.stdout
    });
  }

  return bunyan.createLogger({
    name: 'pandapush',
    streams: logStreams
  });
};
