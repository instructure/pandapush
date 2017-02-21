const dbConfig = require('../knexfile');
const knex = require('knex')(dbConfig[process.env.NODE_ENV]);
const _ = require('lodash');
const token = require('./token');
const cache = require('memory-cache');
const moment = require('moment');

const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS, 10) || 5 * 60 * 1000;
const NOTIFY_CHANNEL = '/internal/meta/config';

const rootAdmins = process.env.ROOT_ADMINS && process.env.ROOT_ADMINS.split(',') || [];
function isRootAdmin (user) {
  return _.indexOf(rootAdmins, user) >= 0;
}

function scopedToUser (query, userId) {
  if (isRootAdmin(userId)) {
    return query;
  }

  return query.whereExists(function () {
    this.select('*')
        .from('application_users')
        .whereRaw('applications.id = application_id')
        .where({
          'user_id': userId
        });
  });
}

// Keep a cache of all application keys so that auth lookups
// don't keep hitting the database. We're keeping an entire data
// set in memory (instead of loading and caching items on demand),
// so we can also reliably say that a key/application does not
// exist without looking in the database. Even for installations with
// lots of applications and keys, this dataset will be tiny.
function populateCache () {
  knex('keys').select('id', 'application_id', 'secret', 'expires').map(key => {
    cache.put('key:' + key.application_id + ':' + key.id, key);
    return key.id;
  })
  .then(keyIds => {
    console.log('reloaded cache with %d items', keyIds.length);
  });
}

let notifyClient = null;

module.exports = {
  init: client => {
    notifyClient = client;
    client.subscribe(NOTIFY_CHANNEL, data => {
      populateCache();
    });

    setInterval(populateCache, CACHE_TTL_MS);
    setTimeout(populateCache, 0);
  },

  getApplications: () => {
    return knex('applications');
  },

  getApplicationsForUser: (userId) => {
    return scopedToUser(knex('applications'), userId);
  },

  getApplicationForUserById: (userId, applicationId) => {
    return scopedToUser(knex('applications'), userId)
      .where('id', applicationId)
      .first();
  },

  getApplicationKeys: (applicationId) => {
    return knex('keys')
      .where('application_id', applicationId);
  },

  getApplicationKey: (applicationId, keyId) => {
    return knex('keys')
      .where('application_id', applicationId)
      .where('id', keyId)
      .first();
  },

  getApplicationUsers: (applicationId) => {
    return knex('application_users')
      .where('application_id', applicationId)
      .select('user_id')
      .map(row => row.user_id);
  },

  getKeyCachedSync: (applicationId, keyId) => {
    return cache.get('key:' + applicationId + ':' + keyId);
  },

  updateApplication: (applicationId, attributes) => {
    const updateAttributes = _.extend({}, _.pick(attributes, [ 'name' ]), {
      updated_at: moment().toISOString()
    });

    return knex('applications')
      .where('id', applicationId)
      .update(updateAttributes);
  },

  updateApplicationAdmins: (applicationId, admins) => {
    return knex.transaction(tx => {
      return tx('application_users')
        .where('application_id', applicationId)
        .del()
        .then(() => {
          return Promise.all(admins.map(admin => {
            return tx('application_users').insert({
              application_id: applicationId,
              user_id: admin
            });
          }));
        });
    });
  },

  addApplication: (name, userId) => {
    const attributes = {
      name: name,
      created_by: userId,
      created_at: moment().toISOString()
    };

    return new Promise((resolve, reject) => {
      token.generate(20)
        .then(id => {
          attributes.id = id;
          return knex('applications').insert(attributes);
        })
        .then(() => {
          return knex('application_users')
            .insert({
              'application_id': attributes.id,
              'user_id': userId
            });
        })
        .then(() => resolve(attributes));
    });
  },

  removeApplication: (applicationId) => {
    return knex.transaction(tx => {
      return tx('application_users')
        .where('application_id', applicationId)
        .del()
        .then(() => {
          return tx('keys')
            .where('application_id', applicationId)
            .del();
        })
        .then(() => {
          notifyClient.publish(NOTIFY_CHANNEL, {});
          return tx('applications')
            .where('id', applicationId)
            .del();
        });
    });
  },

  addKey: (applicationId, expires, purpose, userId) => {
    const attributes = {
      application_id: applicationId,
      created_by: userId,
      expires: expires,
      purpose: purpose,
      created_at: moment().toISOString()
    };

    return new Promise((resolve, reject) => {
      token.generate(16)
        .then(bytes => {
          attributes.id = 'PSID' + bytes;
          return token.generate(40);
        })
        .then(secret => {
          attributes.secret = secret;
          return knex('keys').insert(attributes);
        })
        .then(() => {
          notifyClient.publish(NOTIFY_CHANNEL, {});
          resolve(attributes);
        });
    });
  }
};
