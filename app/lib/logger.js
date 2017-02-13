const bunyan = require('bunyan');
const statsd = require('./statsd');

const logStreams = [];

if (process.env.LOG_PATH) {
  logStreams.push({
    level: 'trace',
    type: 'rotating-file',
    path: process.env.LOG_PATH + '/pandapush.log.json',
    period: '1h',
    count: 24
  });
} else {
  logStreams.push({
    level: 'trace',
    stream: process.stdout
  });
}

let log;
exports.log = log = bunyan.createLogger({
  name: 'pandapush',
  streams: logStreams
});

exports.middleware = function (req, res, next) {
  req.log = log.child({
    request_id: req.id
  });

  const start = Date.now();

  const logResponse = function () {
    const duration = Date.now() - start;

    res.removeListener('finish', logResponse);
    res.removeListener('close', logResponse);
    req.log.info({
      'method': req.method,
      'url': req.url,
      'request_length': req.headers['content-length'],
      'user_agent': req.headers['user-agent'],
      'remote_address': req.ip,
      'remote_addresses': req.ips,
      'duration': duration,
      'status': res.statusCode,
      'response_length': res['_headers']['content-length']
    }, '%s %s finished in %d', req.method, req.url, duration);

    statsd.increment('responses.all.' + res.statusCode);
    statsd.timing('duration.all.' + duration);
  };

  res.on('finish', logResponse);
  res.on('close', logResponse);

  next();
};
