var bunyan = require('bunyan');
var statsd = require('./statsd');

var log_streams = [];

if (process.env.LOG_PATH) {
  log_streams.push({
    level: 'trace',
    type: 'rotating-file',
    path: process.env.LOG_PATH + '/pandapush.log.json',
    period: '1h',
    count: 24
  });
}
else {
  log_streams.push({
    level: 'trace',
    stream: process.stdout
  });
}

var log = null;
exports.log = log = bunyan.createLogger({
  name: 'pandapush',
  streams: log_streams
});

exports.middleware = function(req, res, next) {
  req.log = log.child({
    request_id: req.id
  });

  var start = Date.now();

  var logResponse = function() {
    var duration = Date.now() - start;

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
    }, "%s %s finished in %d", req.method, req.url, duration);

    statsd.increment('responses.all.' + res.statusCode);
    statsd.timing('duration.all.' + duration);
  };

  res.on('finish', logResponse);
  res.on('close', logResponse);

  next();
};
