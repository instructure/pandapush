const AWS = require('aws-sdk');
const _ = require('lodash');
const moment = require('moment');
const awsOptions = require('../aws_options');
const token = require('../token');

const scanOrQueryAll = function (dynamo, tableName, keyConditions, done) {
  const op = keyConditions ? 'query' : 'scan';

  const doScanOrQuery = function (startKey, items) {
    const options = {
      TableName: tableName
    };

    if (keyConditions) {
      options.KeyConditions = keyConditions;
    }

    if (startKey) {
      options.ExclusiveStartKey = startKey;
    }

    dynamo[op](options, function (err, data) {
      if (err) {
        done(err, null);
        return;
      }

      items = items.concat(data.Items);

      if (data.LastEvaluatedKey) {
        doScanOrQuery(data.LastEvaluatedKey, items);
        return;
      }

      done(null, items);
    });
  };

  doScanOrQuery(null, []);
};

const scanAll = function (dynamo, tableName, done) {
  scanOrQueryAll(dynamo, tableName, null, done);
};

const queryAll = function (dynamo, tableName, keyConditions, done) {
  scanOrQueryAll(dynamo, tableName, keyConditions, done);
};

module.exports = function (table) {
  const dynamo = new AWS.DynamoDB(awsOptions(process.env.DYNAMO_ENDPOINT));

  return {
    get: function (done) {
      scanAll(dynamo, table.applications, function (err, applicationItems) {
        if (err) {
          console.log('err loading applications', err);
          done(err);
          return;
        }

        scanAll(dynamo, table.keys, function (err, keyItems) {
          if (err) {
            console.log('err loading keys', err);
            done(err);
            return;
          }

          const apps = _.reduce(applicationItems, function (obj, item) {
            obj[item['application_id'].S] = _.mapValues(item, function (value) {
              return value.S || value.N || value.B || value.SS || value.NS || value.BS;
            });
            return obj;
          }, {});

          _.each(keyItems, function (item) {
            apps[item['application_id'].S].keys = apps[item['application_id'].S].keys || {};
            apps[item['application_id'].S].keys[item['key_id'].S] = _.mapValues(item, function (value) {
              return value.S || value.N || value.B || value.SS || value.NS || value.BS;
            });
          });

          done(null, apps);
        });
      });
    },

    getById: function (id, done) {
      dynamo.getItem({
        TableName: table.applications,
        Key: {
          application_id: { S: id }
        }
      }, function (err, data) {
        if (err) {
          done(err);
          return;
        }

        const item = data.Item;
        if (!item) {
          done();
          return;
        }

        const application = _.mapValues(item, function (value) {
          return value.S || value.N || value.B || value.SS || value.NS || value.BS;
        });

        queryAll(dynamo, table.keys, {
          application_id: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [{ S: id }]
          }
        }, function (err, keyItems) {
          if (err) {
            console.log('error loading keys for application: ', err);
            done(err);
            return;
          }

          application.keys = {};

          _.each(keyItems, function (item) {
            application.keys[item['key_id'].S] = _.mapValues(item, function (value) {
              return value.S || value.N || value.B || value.SS || value.NS || value.BS;
            });
          });

          done(null, application);
        });
      });
    },

    addApplication: function (attributes, done) {
      token.generate(20, function (id) {
        dynamo.putItem({
          TableName: table.applications,
          Item: {
            application_id: { S: id },
            name: { S: attributes.name },
            created_at: { S: moment().toISOString() },
            created_by: { S: attributes.user },
            admins: { SS: attributes.admins }
          },
          Expected: {
            application_id: {
              Exists: false
            }
          }
        }, function (err, data) {
          if (err) {
            done(err);
            return;
          }

          done(null, id);
        });
      });
    },

    addKey: function (applicationId, attributes, done) {
      const expiresAt = moment(attributes.expires);
      if (!expiresAt.isValid()) {
        done('expires is not a valid date', null);
        return;
      }

      // TODO: verify applicationId exists
      token.generate(16, function (keyId) {
        keyId = 'PSID' + keyId;
        token.generate(40, function (keySecret) {
          const key = {
            application_id: applicationId,
            key_id: keyId,
            secret: keySecret,
            created_at: moment().toISOString(),
            created_by: attributes.user,
            expires: expiresAt.toISOString(),
            purpose: attributes.purpose
          };

          // each attribute is a string, so the dynamo item is easy to make
          const item = _.mapValues(key, v => { return { S: v }; });

          dynamo.putItem({
            TableName: table.keys,
            Item: item
          }, function (err, data) {
            if (err) {
              done(err);
              return;
            }

            done(null, key);
          });
        });
      });
    },

    revokeKey: function (applicationId, keyId, done) {
      dynamo.updateItem({
        TableName: table.keys,
        Key: {
          application_id: { S: applicationId },
          key_id: { s: keyId }
        },
        AttributeUpdates: {
          revoked_at: {
            Action: 'PUT',
            Value: { S: moment().toISOString() }
          }
        }
      }, function (err, data) {
        if (err) {
          done(err);
          return;
        }

        done();
      });
    }
  };
};
