const bayeux = require('../lib/bayeux').getClient;

const unauthorized = function (res) {
  res.send(403, 'Unauthorized');
};

const authFromRequest = function (req) {
  // first look for token in query string (least desired method)
  if (req.query.token) {
    return {
      token: req.query.token
    };
  }

  // extract auth from headers
  let auth = req.get('authorization');
  if (!auth) return;

  auth = auth.split(' ', 2);
  if (auth.length < 2 || auth[1].length === 0) {
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
  } else if (auth[0] === 'Token') {
    return {
      token: auth[1]
    };
  }

  return;
};

exports.post = function (req, res) {
  const auth = authFromRequest(req);
  if (!auth) {
    return unauthorized(res);
  }

  const applicationId = req.params[0];
  const type = req.params[1];
  const path = req.params[2];

  const channel = '/' + applicationId + '/' + type + path;
  const payload = req.body;

  if (!payload) {
    return res.send(400, 'No payload');
  }

  if (typeof payload !== 'object') {
    return res.send(400, 'Payload must be an object');
  }

  // afaik, this is the only way to get our auth data into the message.
  // we'll clean it out in a Faye extension.
  payload.__auth = auth;

  const pub = bayeux().publish(channel, payload);

  pub.callback(function () {
    res.send(200, 'OK');
  });

  pub.errback(function (error) {
    res.send(400, error);
  });
};
