#!/usr/bin/env node

'use strict';

require('dotenv').load();

const program = require('commander');
const jwt = require('jsonwebtoken');
const applications = require('../app/lib/applications');

program.version('0.0.1');

program
  .command('add <name> <username>')
  .description('add an application')
  .action(function (name, username) {
    applications.add(name, username, [ username ], function (err, id) {
      if (err) {
        console.log('error adding application: ', err);
        return;
      }

      console.log('application created\n  id: %s', id);
    });
  });

program
  .command('addKey <applicationId> <username> <expires> <purpose>')
  .description('add a key to an application')
  .action(function (applicationId, username, expires, purpose, options) {
    applications.addKey(applicationId, username, expires, purpose, function (err, info) {
      if (err) {
        console.log('error adding key: ', err);
        return;
      }

      console.log('key created:\n  id: %s\n  secret: %s\n  expires: %s\n', info.key_id, info.secret, info.expires);
    });
  });

program
  .command('show')
  .description('show all applications and keys')
  .action(function (applicationId, options) {
    applications.getApplications(function (err, apps) {
      if (err) {
        console.log('error getting apps: ', err);
        return;
      }

      console.log('applications:', JSON.stringify(apps, null, 2));
    });
  });

program
  .command('genToken <applicationId> <keyId> <channel>')
  .option('-p, --pub', 'grant publish rights')
  .option('-s, --sub', 'grant subscribe rights')
  .option('-e, --expires <minutes>', 'how many minutes before the token expires (default: 60)')
  .description('generate a token for the specified application to the specified channel')
  .action(function (applicationId, keyId, channel, options) {
    applications.getApplications(function (err, apps) {
      if (err) {
        console.log('error getting applications', err);
        return;
      }

      const app = apps[applicationId];
      if (!app) {
        console.log('could not find application');
        return;
      }

      const key = app.keys[keyId];
      if (!key) {
        console.log('could not find key');
        return;
      }

      const expires = options.expires || 60;

      const payload = {
        keyId: keyId,
        channel: channel,
        pub: options.pub,
        sub: options.sub
      };
      const token = jwt.sign(payload, key.secret, { expiresInMinutes: expires });

      console.log('token: ' + token);
    });
  });

program.parse(process.argv);
