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
  const dynamo = new AWS.DynamoDB.DocumentClient(awsOptions(process.env.DYNAMO_ENDPOINT));

  const saveApplication = function (existing, id, attributes, done) {
    const newAttributes = _.pick(attributes, [
      'name', 'created_by', 'admins'
    ]);

    if (newAttributes.admins) {
      newAttributes.admins = dynamo.createSet(newAttributes.admins);
    }

    const params = {
      TableName: table.applications,
      Key: {
        application_id: id
      },
      AttributeUpdates: _.mapValues(newAttributes, attr => {
        return {
          Action: 'PUT',
          Value: attr
        };
      })
    };

    if (existing) {
      params.AttributeUpdates.updated_at = {
        Action: 'PUT',
        Value: moment().toISOString()
      };
      params.Expected = {
        application_id: {
          Exists: true,
          Value: id
        }
      };
    } else {
      params.AttributeUpdates.created_at = {
        Action: 'PUT',
        Value: moment().toISOString()
      };
      params.Expected = {
        application_id: {
          Exists: false
        }
      };
    }

    dynamo.update(params, function (err, data) {
      if (err) {
        done(err);
        return;
      }

      done(null, id);
    });
  };

  return {
    get: function (done) {
      scanAll(dynamo, table.applications, function (err, applicationItems) {
        if (err) {
          console.log('err loading applications', err);
          done(err);
          return;
        }

        applicationItems.forEach(item => {
          if (item.admins) {
            item.admins = item.admins.values;
          }
        });

        scanAll(dynamo, table.keys, function (err, keyItems) {
          if (err) {
            console.log('err loading keys', err);
            done(err);
            return;
          }

          const apps = _.reduce(applicationItems, function (obj, item) {
            obj[item['application_id']] = item;
            return obj;
          }, {});

          _.each(keyItems, function (item) {
            apps[item['application_id']].keys = apps[item['application_id']].keys || {};
            apps[item['application_id']].keys[item['key_id']] = item;
          });

          done(null, apps);
        });
      });
    },

    getById: function (id, done) {
      dynamo.getItem({
        TableName: table.applications,
        Key: {
          application_id: id
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
        const application = item;

        if (application.admins) {
          application.admins = application.admins.values;
        }

        queryAll(dynamo, table.keys, {
          application_id: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [ id ]
          }
        }, function (err, keyItems) {
          if (err) {
            console.log('error loading keys for application: ', err);
            done(err);
            return;
          }

          application.keys = {};

          _.each(keyItems, function (item) {
            application.keys[item['key_id']] = item;
          });

          done(null, application);
        });
      });
    },

    addApplication: function (attributes, done) {
      token.generate(20, function (id) {
        saveApplication(false, id, attributes, done);
      });
    },

    updateApplication: function (id, attributes, done) {
      saveApplication(true, id, attributes, done);
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

          dynamo.put({
            TableName: table.keys,
            Item: key
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
          application_id: applicationId,
          key_id: keyId
        },
        AttributeUpdates: {
          revoked_at: {
            Action: 'PUT',
            Value: moment().toISOString()
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
