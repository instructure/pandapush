#!/usr/bin/env node

'use strict';

const Faye = require('faye');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const async = require('async');
const loadTest = require('./lib/loadtest').loadTest;

function makeToken (channel, key, secret, pub, sub) {
  const payload = {
    keyId: key,
    channel: channel,
    pub: pub,
    sub: sub
  };

  return jwt.sign(payload, secret);
}

const masterBase = process.env.MASTER_PANDAPUSH_BASE;
const masterApp = process.env.MASTER_PANDAPUSH_APP;
const masterKey = process.env.MASTER_PANDAPUSH_KEY;
const masterSecret = process.env.MASTER_PANDAPUSH_SECRET;

const clientName = process.env.HOSTNAME + '-' + process.pid;

const faye = new Faye.Client(masterBase);
const masterChannelBase = `/${masterApp}/private`;
const token = makeToken(`${masterChannelBase}/**`, masterKey, masterSecret, true, true);
faye.addExtension({
  outgoing: function (message, callback) {
    message.ext = message.ext || {};
    message.ext.auth = {
      token: token
    };
    callback(message);
  }
});

const pingChannel = `${masterChannelBase}/ping/${clientName}`;
setInterval(function () {
  faye.publish(pingChannel, {});
}, 5000);

faye.subscribe(`${masterChannelBase}/jobs`, function (message) {
  console.log('got job', message);
  const testId = message.testId;
  const responseChannel = `${masterChannelBase}/${testId}/${clientName}`;

  let progress = {};

  const publishProgressInterval = setInterval(function () {
    faye.publish(responseChannel, progress);
  }, 5000);

  loadTest(
    message.url,
    message.appid,
    message.keyid,
    message.secret,
    message.numusers,
    message.ppu,
    message.pushrate,
    function (p) {
      progress = p;
    }, function () {
      faye.publish(responseChannel, progress);
      faye.publish(responseChannel, { done: true });
      clearInterval(publishProgressInterval);
    });
}).then(function () {
  console.log(`subscribed to ${masterChannelBase}/jobs`);
}).catch(function (err) {
  console.log('error subscribing to job channel', err);
});
