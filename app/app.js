'use strict';

require('dotenv').load();

var http           = require('http'),
    express        = require('express'),
    session        = require('cookie-session'),
    bodyParser     = require('body-parser'),
    basicAuth      = require('basic-auth-connect'),
    cas            = require('grand_master_cas'),
    fs             = require('fs'),
    path           = require('path'),
    crypto         = require('crypto'),
    spawn          = require('child_process').spawn,
    bayeux         = require('./lib/bayeux'),
    store          = require('./lib/store'),
    cookieSessions = require('./lib/cookie_sessions'),
    logger         = require('./lib/logger'),
    statsd         = require('./lib/statsd'),
    routes         = require('./routes'),
    httpMetrics    = require('./lib/http_metrics');

var app = express(),
    server = http.Server(app);


// create session private key if one is not provided

var sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;
if (!sessionPrivateKey) {
  var destdir = path.resolve(__dirname, '../localdata');
  var filename = destdir + '/session.key';

  console.log("WARNING: no SESSION_PRIVATE_KEY configured, using one in " + filename);
  if (!fs.existsSync(destdir)) {
    fs.mkdirSync(destdir);
  }

  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, crypto.randomBytes(256).toString('base64'));
  }

  sessionPrivateKey = fs.readFileSync(filename);
}


// configure admin auth
var adminAuth = {
  logout: function(req, res, next) { next(); },
  bouncer: function(req, res, next) { res.send(403, "Unauthorized"); },
  blocker: function(req, res, next) { res.send(403, "Unauthorized"); }
};

if (process.env.CAS_HOST) {
  cas.configure({
    casHost: process.env.CAS_HOST,
    casPath: process.env.CAS_PATH,
    service: process.env.CAS_SERVICE,
    ssl: true,
    port: 443
  });

  adminAuth = cas;
}
else if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
  var auth = basicAuth(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

  adminAuth = {
    logout: function(req, res, next) {
      next();
    },
    bouncer: auth,
    blocker: auth
  };
}

// If redis conn info was not provided, start our own local process
// This is mostly for local development.
if (!process.env.REDIS_HOSTS) {
  spawn("/usr/bin/redis-server", ["--port", "6379"], { detached: true });
  process.env.REDIS_HOSTS = "localhost:6379";
}

// attach bayeux handlers
bayeux.attach(server);

// set up http metric gatherer (needs to happen after bayeux.attach)
httpMetrics(server, logger.log);


// configure Express application

app.enable('trust proxy');
app.use(require('connect-requestid'));
app.use(logger.middleware);
app.use(session({ keys: [ sessionPrivateKey ] }));
app.use(bodyParser.json());
routes.map(app, adminAuth);
app.use(express.static(__dirname + '/../ui/public'));


// start some utility modules
store.init(bayeux, function() {
  // start server
  var port = process.env.PORT || 3000;
  server.listen(port, function() {
    console.log("listening on port " + port);
  });
});
