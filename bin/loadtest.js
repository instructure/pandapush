#!/usr/bin/env node

'use strict';

const Faye = require('faye');
const program = require('commander');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const async = require('async');

program.version('0.0.1');

function makeToken (channel, key, secret, pub, sub) {
  const payload = {
    keyId: key,
    channel: channel,
    pub: pub,
    sub: sub,
    exp: (Date.now() / 1000) + 3600
  };

  return jwt.sign(payload, secret);
}

program
  .command('loadtest <url> <appid> <keyid> <secret> <numusers> <pushesperuser> <pushrate>')
  .description('perform a loadtest')
  .action(function (url, appid, keyid, secret, numusers, ppu, pushrate, options) {
    const userIds = _.range(numusers);

    let waitingReceive = numusers * ppu;
    let waitingPush = numusers * ppu;
    const subscribed = [];

    async.parallelLimit(_.map(userIds, function (n) {
      return function (done) {
        const channel = '/' + appid + '/private/users/' + n;
        const token = makeToken(channel, keyid, secret, false, true);

        const client = new Faye.Client(url);
        client.addExtension({
          outgoing: function (message, callback) {
            message.ext = message.ext || {};
            message.ext.auth = { token: token };
            callback(message);
          }
        });

        const start = Date.now();
        client.subscribe(channel, function (message) {
          waitingReceive -= 1;
          subscribed[n] -= 1;
          console.log(`${n} received message ${message.msg} (waiting for ${waitingReceive} more)`);
          if (waitingPush === 0 && waitingReceive === 0) {
            console.log('exiting SUCCESS');
            process.exit(0);
          }
        }).then(function () {
          subscribed[n] = 0;
          console.log(`${n} subscribed in ${Date.now() - start} ms (${subscribed.length} subscribed)`);
          done();
        }, function (err) {
          console.log(`${n} FAILED SUBSCRIBE in ${Date.now() - start} ms`);
          console.log('err:', err);
          done(err);
        });
      };
    }), 50);

    // wait 5 seconds before we start publishing
    setTimeout(function () {
      const client = new Faye.Client(url);
      client.addExtension({
        outgoing: function (message, callback) {
          message.ext = message.ext || {};
          message.ext.auth = {
            key: keyid,
            secret: secret
          };
          callback(message);
        }
      });

      function doNext () {
        const n = _.sample(_.keys(subscribed));
        subscribed[n] += 1;
        waitingPush -= 1;

        const channel = '/' + appid + '/private/users/' + n;
        const start = Date.now();
        client.publish(channel, {
          msg: 'publish to ' + channel
        }).then(function () {
          console.log(`${n} published in ${Date.now() - start} ms`);
        }, function () {
          console.log(`${n} FAILED PUBLISH in ${Date.now() - start} ms`);
        });

        if (waitingPush > 0) {
          setTimeout(doNext, 1000 / pushrate);
        } else {
          console.log('done publishing');
        }
      }
      doNext();
    }, 5000);
  });

program.parse(process.argv);
