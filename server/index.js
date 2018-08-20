require("dotenv").load();

const http = require("http");
const express = require("express");
const session = require("cookie-session");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const spawn = require("child_process").spawn;
const faye = require("./lib/faye");
const logger = require("./lib/logger")();
const loggerMiddleware = require("./lib/middlewares/logger");
const statsdMiddleware = require("./lib/middlewares/statsd");
const routes = require("./routes");
const httpMetrics = require("./lib/http_metrics");
const store = require("./lib/store");
const createAdminAuth = require("./admin_auth");

const app = express();
const server = http.Server(app);

// create session private key if one is not provided

let sessionPrivateKey = process.env.SESSION_PRIVATE_KEY;
if (!sessionPrivateKey) {
  const destdir = path.resolve(__dirname, "../localdata");
  const filename = destdir + "/session.key";

  console.log(
    "WARNING: no SESSION_PRIVATE_KEY configured, using one in " + filename
  );
  if (!fs.existsSync(destdir)) {
    fs.mkdirSync(destdir);
  }

  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, crypto.randomBytes(256).toString("base64"));
  }

  sessionPrivateKey = fs.readFileSync(filename);
}

const adminAuth = createAdminAuth(process.env);

// If redis conn info was not provided, start our own local process
// This is mostly for local development.
if (!process.env.REDIS_HOSTS && !process.env.REDIS_URL_ENV_VARS) {
  spawn("/usr/bin/redis-server", ["--port", "6379"], { detached: true });
  process.env.REDIS_HOSTS = "localhost:6379";
}

// attach faye handlers
const fayeInstance = faye(server);

// initialize the store
store.init(fayeInstance.internalClient);

// set up http metric gatherer (needs to happen after faye initialization)
httpMetrics(server, logger, fayeInstance.internalClient).start();

// configure Express application

app.enable("trust proxy");
app.use(require("connect-requestid"));
app.use(loggerMiddleware(logger));
app.use(statsdMiddleware());
app.use(session({ keys: [sessionPrivateKey] }));
app.use(bodyParser.json());

if (adminAuth && adminAuth.router) {
  app.use(adminAuth.router);
}

// some requests will need access to the internal faye client
app.use((req, res, next) => {
  req.faye = fayeInstance;
  next();
});

routes.map(app, adminAuth);
app.use(express.static(path.join(__dirname, "../ui/public")));

const port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log("listening on port " + port);
});
