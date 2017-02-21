/* eslint-env jest */

const jwt = require('jsonwebtoken');
const _ = require('lodash');

const token = function (attrs, secret) {
  const defaults = {
    keyId: 'goodkey',
    channel: '/appid/private/channel',
    exp: Date.now() / 1000 + 360
  };

  const payload = _.merge(defaults, attrs);
  return jwt.sign(payload, secret || database['appid'].keys[payload.keyId].secret);
};

const mockDatabase = {
  'appid': {
    keys: {
      'goodkey': {
        id: 'goodkey',
        secret: 'goodkeysecret',
        expires: '2100-01-01T00:00:00Z'
      },
      'expiredkey': {
        id: 'expiredkey',
        secret: 'expiredkeysecret',
        expires: '2000-01-01T00:00:00Z'
      },
      'revokedkey': {
        id: 'revokedkey',
        secret: 'revokedkeysecret',
        expires: '2100-01-01T00:00:00Z',
        revoked_at: '2010-01-01T00:00:00Z'
      }
    }
  }
};
const database = mockDatabase;

jest.mock('../../store', () => {
  return {
    getKeyCachedSync: function (applicationId, keyId) {
      if (mockDatabase[applicationId]) {
        return mockDatabase[applicationId].keys[keyId];
      }
      return null;
    }
  };
});
const auth = require('../auth')('internalToken');

// These tests could use some DRY'ing up (there's some combinatorial
// explosion happening...)

describe('auth extension', function () {
  it('fails on an invalid channel', function (done) {
    auth.incoming({
      channel: '/meta/subscribe',
      subscription: '/appid/invalid/channel'
    }, function (message) {
      expect(message.error).toBeTruthy();
      done();
    });
  });

  it('fails on an invalid token', function (done) {
    auth.incoming({
      channel: '/meta/subscribe',
      subscription: '/appid/private/channel',
      ext: {
        auth: {
          token: 'badtoken'
        }
      }
    }, function (message) {
      expect(message.error).toBeTruthy();
      done();
    });
  });

  it('fails without any auth', function (done) {
    auth.incoming({
      channel: '/meta/subscribe',
      subscription: '/appid/private/channel',
      ext: {
        auth: {
          foo: 'bar'
        }
      }
    }, function (message) {
      expect(message.error).toBeTruthy();
      done();
    });
  });

  it('fails with a bad secret', function (done) {
    auth.incoming({
      channel: '/meta/subscribe',
      subscription: '/appid/private/channel',
      ext: {
        auth: {
          key: 'goodkey',
          secret: 'wrongsecret'
        }
      }
    }, function (message) {
      expect(message.error).toBeTruthy();
      done();
    });
  });

  it('strips auth info from outgoing messages', function (done) {
    auth.outgoing({
      ext: {
        auth: {
          token: 'token'
        }
      },
      data: {
        __auth: {
          token: 'token'
        }
      }
    }, function (message) {
      expect(message.ext.auth).toBeUndefined();
      expect(message.__auth).toBeUndefined();
      done();
    });
  });

  it('allows subscribing with internal token', function (done) {
    auth.incoming({
      channel: '/meta/subscribe',
      subscription: '/appid/private/channel',
      ext: {
        internalToken: 'internalToken'
      }
    }, function (message) {
      expect(message.error).toBeUndefined();
      done();
    });
  });

  it('does not fail for non-subscribing meta channels', function (done) {
    auth.incoming({
      channel: '/meta/foo',
      subscription: '/appid/private/channel'
    }, function (message) {
      expect(message.error).toBeUndefined();
      done();
    });
  });

  it('does not fail when there\'s nothing to strip', function (done) {
    auth.outgoing({}, function (message) {
      expect(message).toBeTruthy();
      done();
    });
  });

  describe('subscribing', function () {
    describe('to public channels', function () {
      it('allows subscription without auth', function (done) {
        auth.incoming({
          channel: '/meta/subscribe',
          subscription: '/appid/public/channel'
        }, function (message) {
          expect(message.error).toBeUndefined();
          done();
        });
      });
    });

    describe('to private channels', function () {
      it('fails without any authentication', function (done) {
        auth.incoming({
          channel: '/meta/subscribe',
          subscription: '/appid/private/channel'
        }, function (message) {
          expect(message.error).toBeTruthy();
          done();
        });
      });

      describe('with token auth', function () {
        it('works with a valid token', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('works with a valid token for a wildcard channel', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/something_random',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/*', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('works with a valid token for a recursive wildcard channel', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/something/random/again',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/**', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('fails with a single-level wildcard token on longer path', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/something/random/again',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/*', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an expired key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'expiredkey', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a revoked key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'revokedkey', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an expired token', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: true, exp: 1 })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a token for a different channel', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel2',
            ext: {
              auth: {
                token: token({ sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a token that can\'t subscribe', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ sub: false })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown application', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid2/private/channel',
            ext: {
              auth: {
                token: token({ channel: '/appid2/private/channel', sub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'unknownkey', sub: true }, 'unknownkeysecret')
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });
      });

      describe('with key/secret auth', function () {
        const authForKey = function (keyname) {
          return {
            key: keyname,
            secret: database['appid'].keys[keyname].secret
          };
        };

        it('works with a valid key/secret', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey('goodkey') }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('fails with an expired key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey('expiredkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a revoked key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: { auth: authForKey('revokedkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown application', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid2/private/channel',
            ext: { auth: authForKey('goodkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown key', function (done) {
          auth.incoming({
            channel: '/meta/subscribe',
            subscription: '/appid/private/channel',
            ext: {
              auth: {
                key: 'unknownkey',
                secret: 'unknownkeysecret'
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });
      });
    });
  });

  describe('publishing', function () {
    describe('to public channels', function () {
      it('fails without any authentication', function (done) {
        auth.incoming({
          channel: '/appid/public/channel'
        }, function (message) {
          expect(message.error).toBeTruthy();
          done();
        });
      });
    });

    describe('to private channels', function () {
      it('fails without any authentication', function (done) {
        auth.incoming({
          channel: '/appid/private/channel'
        }, function (message) {
          expect(message.error).toBeTruthy();
          done();
        });
      });

      describe('with token auth', function () {
        it('works with a valid token', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('works with a valid token for a wildcard channel', function (done) {
          auth.incoming({
            channel: '/appid/private/something_random',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/*', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('works with a valid token for a recursive wildcard channel', function (done) {
          auth.incoming({
            channel: '/appid/private/something/random/again',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/**', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('fails with a single-level wildcard token on longer path', function (done) {
          auth.incoming({
            channel: '/appid/private/something/random/again',
            ext: {
              auth: {
                token: token({ channel: '/appid/private/*', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an expired key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'expiredkey', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a revoked key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'revokedkey', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an expired token', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: true, exp: 1 })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a token for a different channel', function (done) {
          auth.incoming({
            channel: '/appid/private/channel2',
            ext: {
              auth: {
                token: token({ pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a token that can\'t subscribe', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ pub: false })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown application', function (done) {
          auth.incoming({
            channel: '/appid2/private/channel',
            ext: {
              auth: {
                token: token({ channel: '/appid2/private/channel', pub: true })
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                token: token({ keyId: 'unknownkey', pub: true }, 'unknownkeysecret')
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });
      });

      describe('with key/secret auth', function () {
        const authForKey = function (keyname) {
          return {
            key: keyname,
            secret: database['appid'].keys[keyname].secret
          };
        };

        it('works with a valid key/secret', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey('goodkey') }
          }, function (message) {
            expect(message.error).toBeUndefined();
            done();
          });
        });

        it('fails with an expired key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey('expiredkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with a revoked key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: { auth: authForKey('revokedkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown application', function (done) {
          auth.incoming({
            channel: '/appid2/private/channel',
            ext: { auth: authForKey('goodkey') }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });

        it('fails with an unknown key', function (done) {
          auth.incoming({
            channel: '/appid/private/channel',
            ext: {
              auth: {
                key: 'unknownkey',
                secret: 'unknownkeysecret'
              }
            }
          }, function (message) {
            expect(message.error).toBeTruthy();
            done();
          });
        });
      });
    });
  });
});
