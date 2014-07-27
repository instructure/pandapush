var sinon      = require('sinon'),
    proxyquire = require('proxyquire'),
    jwt        = require('jsonwebtoken'),
    _          = require('lodash');

var database = {
  'appid': {
    keys: {
      'goodkey': {
        key_id: 'goodkey',
        secret: 'goodkeysecret',
        expires: '2100-01-01T00:00:00Z'
      },
      'expiredkey': {
        key_id: 'expiredkey',
        secret: 'expiredkeysecret',
        expires: '2000-01-01T00:00:00Z'
      },
      'revokedkey': {
        key_id: 'revokedkey',
        secret: 'revokedkeysecret',
        expires: '2100-01-01T00:00:00Z',
        revoked_at: '2010-01-01T00:00:00Z'
      }
    }
  }
};

var token = function(attrs, secret) {
  var defaults = {
    keyId: 'goodkey',
    channel: '/appid/private/channel',
    exp: Date.now() / 1000 + 360
  };

  var payload = _.merge(defaults, attrs);
  return jwt.sign(payload, secret || database["appid"].keys[payload.keyId].secret);
};

var storeStub = {
  getByIdCached: function(id, done) {
    done(null, database[id]);
  }
};

var auth = proxyquire('../../../../app/lib/extensions/auth', { '../store': storeStub });
var auth = auth('internalToken');

// These tests could use some DRY'ing up (there's some combinatorial
// explosion happening...)

describe('auth extension', function() {
  it('strips auth info from outgoing messages', function(done) {
    auth.outgoing({
      ext: {
        auth: {
          token: "token"
        }
      },
      data: {
        __auth: {
          token: "token"
        }
      }
    }, function(message) {
      message.ext.should.not.have.property('auth');
      message.should.not.have.property('__auth');
      done();
    });
  });

  describe('subscribing', function() {
    describe('to public channels', function() {
      it('allows subscription without auth', function(done) {
        auth.incoming({
          channel: '/meta/subscribe',
          subscription: '/appid/public/channel'
        }, function(message) {
          message.should.not.have.property('error');
          done();
        });
      });
    });

    describe('to private channels', function() {
      it('fails without any authentication', function(done) {
        auth.incoming({
          channel: '/meta/subscribe',
          subscription: '/appid/private/channel'
        }, function(message) {
          message.should.have.property('error');
          done();
        });
      });

      describe('with token auth', function() {
        it('works with a valid token', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: true })
              }
            }
          }, function(message) {
            message.should.not.have.property('error');
            done();
          });
        });

        it('fails with an expired key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "expiredkey", sub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a revoked key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "revokedkey", sub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an expired token', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: true, exp: 1 })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a token for a different channel', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel2',
            ext: {
              auth: {
                token: token({ sub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a token that can\'t subscribe', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: false })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown application', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid2/private/channel',
            ext: {
              auth: {
                token: token({ channel: '/appid2/private/channel', sub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "unknownkey", sub: true }, "unknownkeysecret")
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });
      });

      describe('with key/secret auth', function() {

        var authForKey = function(keyname) {
          return {
            key: keyname,
            secret: database["appid"].keys[keyname].secret
          };
        }

        it('works with a valid key/secret', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey("goodkey") }
          }, function(message) {
            message.should.not.have.property('error');
            done();
          });
        });

        it('fails with an expired key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey("expiredkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a revoked key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey("revokedkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown application', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid2/private/channel',
            ext: { auth: authForKey("goodkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown key', function(done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                key: "unknownkey",
                secret: "unknownkeysecret"
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });
      });
    });
  });

  describe('publishing', function() {
    describe('to public channels', function() {
      it('fails without any authentication', function(done) {
        auth.incoming({
          channel: '/appid/public/channel'
        }, function(message) {
          message.should.have.property('error');
          done();
        });
      });
    });

    describe('to private channels', function() {
      it('fails without any authentication', function(done) {
        auth.incoming({
          channel: '/appid/private/channel'
        }, function(message) {
          message.should.have.property('error');
          done();
        });
      });

      describe('with token auth', function() {
        it('works with a valid token', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: true })
              }
            }
          }, function(message) {
            message.should.not.have.property('error');
            done();
          });
        });

        it('fails with an expired key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "expiredkey", pub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a revoked key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "revokedkey", pub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an expired token', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: true, exp: 1 })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a token for a different channel', function(done) {
          auth.incoming({
            channel: '/appid/private/channel2',
            ext: {
              auth: {
                token: token({ pub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a token that can\'t subscribe', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: false })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown application', function(done) {
          auth.incoming({
            channel: '/appid2/private/channel',
            ext: {
              auth: {
                token: token({ channel: '/appid2/private/channel', pub: true })
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: "unknownkey", pub: true }, "unknownkeysecret")
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });
      });

      describe('with key/secret auth', function() {

        var authForKey = function(keyname) {
          return {
            key: keyname,
            secret: database["appid"].keys[keyname].secret
          };
        }

        it('works with a valid key/secret', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey("goodkey") }
          }, function(message) {
            message.should.not.have.property('error');
            done();
          });
        });

        it('fails with an expired key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey("expiredkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with a revoked key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey("revokedkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown application', function(done) {
          auth.incoming({
            channel: '/appid2/private/channel',
            ext: { auth: authForKey("goodkey") }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });

        it('fails with an unknown key', function(done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                key: "unknownkey",
                secret: "unknownkeysecret"
              }
            }
          }, function(message) {
            message.should.have.property('error');
            done();
          });
        });
      });
    });
  });
});
