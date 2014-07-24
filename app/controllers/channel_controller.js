var path   = require('path'),
    bayeux = require('../lib/bayeux').getClient;

var unauthorized = function(res) {
  res.send(403, 'Unauthorized');
};

var authFromRequest = function(req) {
  // extract auth from headers
  var auth = req.get('authorization');
  if (!auth) return;

  var auth = auth.split(' ', 2);
  if (auth.length < 2 || auth[1].length == 0) {
    return;
  }

  if (auth[0] === 'Basic') {
    auth = new Buffer(auth[1], 'base64').toString();
    auth = auth.match(/^([^:]*):(.*)$/);
    if (!auth) return;

    return {
      key: auth[1],
      secret: auth[2]
    };
  }
  else if (auth[0] === 'Token') {
    return {
      token: auth[1]
    }
  }

  return;
};

exports.post = function(req, res) {
  var auth = authFromRequest(req);
  if (!auth) {
    return unauthorized(res);
  }

  var applicationId = req.params[0],
      type = req.params[1],
      path = req.params[2];

  console.log("params", req.params);
  var channel = '/' + applicationId + '/' + type + path;
  var payload = req.body;

  console.log("CHANNEL: " + channel);

  if (!payload) {
    return res.send(400, 'No payload');
  }

  if (typeof payload !== 'object') {
    return res.send(400, 'Payload must be an object');
  }

  // afaik, this is the only way to get our auth data into the message.
  // we'll clean it out in a Faye extension.
  payload.__auth = auth;

  pub = bayeux().publish(channel, payload);

  pub.callback(function() {
    res.send(200, 'OK');
  });

  pub.errback(function(error) {
    res.send(400, error);
  });
}
