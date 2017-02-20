'use strict';

require('dotenv').load();

const http = require('http');
const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const basicAuth = require('basic-auth-connect');
const cas = require('grand_master_cas');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const spawn = require('child_process').spawn;
const bayeux = require('./lib/bayeux');
const logger = require('./lib/logger');
const routes = require('./routes');
const httpMetrics = require('./lib/http_metrics');

const app = express();
const server = http.Server(app);

// create session private key if one is not provided

let sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;
if (!sessionPrivateKey) {
  const destdir = path.resolve(__dirname, '../localdata');
  const filename = destdir + '/session.key';

  console.log('WARNING: no SESSION_PRIVATE_KEY configured, using one in ' + filename);
  if (!fs.existsSync(destdir)) {
    fs.mkdirSync(destdir);
  }

  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, crypto.randomBytes(256).toString('base64'));
  }

  sessionPrivateKey = fs.readFileSync(filename);
}

// configure admin auth
let adminAuth = {
  logout: function (req, res, next) { next(); },
  bouncer: function (req, res, next) { res.send(403, 'Unauthorized'); },
  blocker: function (req, res, next) { res.send(403, 'Unauthorized'); }
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
} else if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
  const auth = basicAuth(process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

  adminAuth = {
    logout: function (req, res, next) { next(); },
    bouncer: auth,
    blocker: auth
  };
}

// If redis conn info was not provided, start our own local process
// This is mostly for local development.
if (!process.env.REDIS_HOSTS && !process.env.REDIS_URL_ENV_VARS) {
  spawn('/usr/bin/redis-server', ['--port', '6379'], { detached: true });
  process.env.REDIS_HOSTS = 'localhost:6379';
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
app.use(express.static(path.join(__dirname, '../ui/public')));

const port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('listening on port ' + port);
});
