'use strict';

require('dotenv').load();

function runServer() {
  var http           = require('http'),
      express        = require('express'),
      session        = require('cookie-session'),
      bodyParser     = require('body-parser'),
      basicAuth      = require('basic-auth-connect'),
      cas            = require('grand_master_cas'),
      fs             = require('fs'),
      path           = require('path'),
      crypto         = require('crypto'),
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


  // attach bayeux handlers
  bayeux.attach(server);


  // set up http metric gatherer (needs to happen after bayeux.attach)
  httpMetrics(server);


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
}

var workers = process.env.NODE_WORKERS || 0
if (workers == 0) {
  runServer();
}
else {
  var cluster = require('cluster');

  if (workers < 0) {
    workers = require('os').cpus().length;
  }

  if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < workers; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' died');

      // For now, we'll have everything restart on a failure.
      // It may be better to just attempt re-forking the child,
      // but that will need backoff logic and stuff around it.
      // Doing this we're punting to letting our parent restart
      // us or not.
      process.exit(1);
    });
  }
  else {
    runServer();
  }
}
