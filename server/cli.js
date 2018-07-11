#!/usr/bin/env node

require("dotenv").load();

const program = require("commander");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const store = require("../server/lib/store");

program.version("0.0.1");

program
  .command("add <name> <username>")
  .description("add an application")
  .action(function(name, username) {
    store
      .addApplication(name, username)
      .then(application => {
        console.log(JSON.stringify(application, null, 2));
        process.exit(0);
      })
      .catch(err => {
        console.log("error adding application", err);
        process.exit(1);
      });
  });

program
  .command("addKey <applicationId> <username> <purpose>")
  .description("add a key to an application")
  .option(
    "-e, --expires <duration>",
    "how long before the key should expire (in ISO 8601, like P1Y for one year)"
  )
  .action(function(applicationId, username, purpose, options) {
    let expires;
    if (options.expires) {
      expires = moment()
        .add(moment.duration(options.expires))
        .toISOString();
    }
    store
      .addKey(applicationId, expires, purpose, username)
      .then(key => {
        if (!key) {
          console.log("could not find key");
          process.exit(1);
        }

        console.log(JSON.stringify(key, null, 2));
        process.exit(0);
      })
      .catch(err => {
        console.log("error adding key", err);
        process.exit(1);
      });
  });

program
  .command("show")
  .description("show all applications")
  .action(function(applicationId, options) {
    store
      .getApplications()
      .then(applications => {
        console.log(JSON.stringify(applications, null, 2));
        process.exit(0);
      })
      .catch(err => {
        console.log("error getting applications", err);
        process.exit(1);
      });
  });

program
  .command("genToken <applicationId> <keyId> <channel>")
  .option("-p, --pub", "grant publish rights")
  .option("-s, --sub", "grant subscribe rights")
  .option(
    "-e, --expires <duration>",
    "how long before the token should expire (in ISO 8601, default: P1H)"
  )
  .description(
    "generate a token for the specified application to the specified channel"
  )
  .action(function(applicationId, keyId, channel, options) {
    let expires = moment().add(1, "hour");
    if (options.expires) {
      expires = moment().add(moment.duration(options.expires));
    }

    store
      .getApplicationKey(applicationId, keyId)
      .then(key => {
        if (!key) {
          console.log("could not find key");
          process.exit(1);
        }

        const payload = {
          keyId: keyId,
          channel: channel,
          pub: options.pub,
          sub: options.sub,
          exp: expires.unix()
        };
        const token = jwt.sign(payload, key.secret);

        console.log(token);
        process.exit(0);
      })
      .catch(err => {
        console.log("error getting key", err);
        process.exit(1);
      });
  });

program.parse(process.argv);
