#!/usr/bin/env node

'use strict';

const Client = require('../client/index').Client;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const loadTest = require('./lib/loadtest').loadTest;

function makeToken (channel, key, secret, pub, sub, presence) {
  const payload = {
    keyId: key,
    channel: channel,
    pub: pub,
    sub: sub,
    presence: presence
  };

  return jwt.sign(payload, secret);
}

const masterBase = process.env.MASTER_PANDAPUSH_BASE;
const masterApp = process.env.MASTER_PANDAPUSH_APP;
const masterKey = process.env.MASTER_PANDAPUSH_KEY;
const masterSecret = process.env.MASTER_PANDAPUSH_SECRET;

const clientName = process.env.HOSTNAME + '-' + process.pid;

const client = new Client(masterBase);
const masterChannelBase = `/${masterApp}/private`;
const token = makeToken(`${masterChannelBase}/**`, masterKey, masterSecret, true, true);

const presenceChannel = `/${masterApp}/presence/workers`;
const presenceToken = makeToken(presenceChannel, masterKey, masterSecret, false, true, {
  id: clientName
});

client.subscribeTo(presenceChannel, presenceToken, () => {})
  .then(function () {
    console.log('subscribed to ', presenceChannel);
  }, function (err) {
    console.log('error subscribing', err);
  });

client.subscribeTo(`${masterChannelBase}/jobs`, token, function (message) {
  console.log('got job', message);
  const testId = message.testId;
  const responseChannel = `${masterChannelBase}/${testId}/${clientName}`;

  let progress = {};

  const publishProgressInterval = setInterval(function () {
    client.publishTo(responseChannel, token, progress);
  }, 500);

  loadTest(
    message.url,
    message.appid,
    message.keyid,
    message.secret,
    message.numusers,
    message.ppu,
    message.pushrate,
    clientName,
    function (p) {
      progress = p;
    }, function () {
      client.publishTo(responseChannel, token, _.merge({}, progress, { done: true }));
      clearInterval(publishProgressInterval);
    });
}).then(function () {
  console.log(`subscribed to ${masterChannelBase}/jobs`);
}).catch(function (err) {
  console.log('error subscribing to job channel', err);
});
