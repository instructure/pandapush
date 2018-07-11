const Faye = require("faye");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const async = require("async");

function makeToken(channel, key, secret, pub, sub) {
  const payload = {
    keyId: key,
    channel: channel,
    pub: pub,
    sub: sub,
    exp: Date.now() / 1000 + 3600
  };

  return jwt.sign(payload, secret);
}

function loadTest(
  url,
  appid,
  keyid,
  secret,
  numusers,
  ppu,
  pushrate,
  clientId,
  progress,
  done
) {
  const userIds = _.range(numusers);

  let waitingReceive = numusers * ppu;
  let waitingPush = numusers * ppu;
  let failedSubscribe = 0;
  let failedPublish = 0;
  const subscribed = {};

  function sendProgress() {
    progress({
      waitingReceive,
      waitingPush,
      subscribed: _.size(subscribed),
      failedSubscribe,
      failedPublish
    });
  }

  const clients = [];

  function finish() {
    sendProgress();
    clients.forEach(client => client.disconnect());
    done();
  }

  async.parallelLimit(
    _.map(userIds, function(n) {
      return function(done) {
        const channel = "/" + appid + "/private/" + clientId + "/users/" + n;
        const token = makeToken(channel, keyid, secret, false, true);

        const client = new Faye.Client(url);
        clients.push(client);
        client.addExtension({
          outgoing: function(message, callback) {
            message.ext = message.ext || {};
            message.ext.auth = { token: token };
            callback(message);
          }
        });

        const start = Date.now();
        client
          .subscribe(channel, function(message) {
            waitingReceive -= 1;
            subscribed[n] -= 1;
            sendProgress();
            console.log(
              `${n} received message ${
                message.msg
              } (waiting for ${waitingReceive} more)`
            );
            if (waitingPush === 0 && waitingReceive === 0) {
              console.log("done");
              finish();
            }
          })
          .then(
            function() {
              subscribed[n] = 0;
              sendProgress();
              console.log(
                `${n} subscribed in ${Date.now() - start} ms (${_.size(
                  subscribed
                )} subscribed)`
              );
              done();
            },
            function(err) {
              failedSubscribe += 1;
              sendProgress();
              console.log(`${n} FAILED SUBSCRIBE in ${Date.now() - start} ms`);
              console.log("err:", err);
              done();
            }
          );
      };
    }),
    50,
    (err, results) => {
      if (err) {
        console.log("error subscribing", err);
      }

      const client = new Faye.Client(url);
      clients.push(client);
      client.addExtension({
        outgoing: function(message, callback) {
          message.ext = message.ext || {};
          message.ext.auth = {
            key: keyid,
            secret: secret
          };
          callback(message);
        }
      });

      function doNext() {
        const n = _.sample(_.keys(subscribed));
        subscribed[n] += 1;
        waitingPush -= 1;

        const channel = "/" + appid + "/private/" + clientId + "/users/" + n;
        const start = Date.now();
        client
          .publish(channel, {
            msg: "publish to " + channel
          })
          .then(
            function() {
              sendProgress();
              console.log(`${n} published in ${Date.now() - start} ms`);
            },
            function(err) {
              failedPublish += 1;
              sendProgress();
              console.log(
                `${n} FAILED PUBLISH in ${Date.now() - start} ms`,
                err
              );
            }
          );

        if (waitingPush > 0) {
          setTimeout(doNext, 1000 / pushrate);
        } else {
          console.log("done publishing");
        }
      }
      doNext();
    }
  );
}

exports.loadTest = loadTest;
