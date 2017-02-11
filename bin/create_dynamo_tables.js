var async = require('async');
var AWS = require('aws-sdk');
var awsOptions = require('../app/lib/aws_options');

var dynamo = new AWS.DynamoDB(awsOptions(process.env.DYNAMO_ENDPOINT));

var tableDefinitions = [
  {
    TableName: process.env.DYNAMO_APPLICATIONS,
    AttributeDefinitions: [
      { AttributeName: 'application_id',
        AttributeType: 'S' }
    ],
    KeySchema: [
      { AttributeName: 'application_id',
        KeyType: 'HASH' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 20,
      WriteCapacityUnits: 20
    }
  },
  {
    TableName: process.env.DYNAMO_KEYS,
    AttributeDefinitions: [
      { AttributeName: 'application_id',
        AttributeType: 'S' },
      { AttributeName: 'key_id',
        AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'application_id',
        KeyType: 'HASH' },
      { AttributeName: 'key_id',
        KeyType: 'RANGE' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 20,
      WriteCapacityUnits: 20
    }
  },
];

var handleCreate = function (err, data, def, callback) {
  if (err) {
    if (err.code === 'ResourceInUseException') {
      console.log(def.TableName, 'already exists')
      // ok, already setup
    } else {
      console.log('Error creating table', err)
      throw err
    }
  } else {
    console.log('[' + data.TableDescription.TableStatus + '] ' + data.TableDescription.TableName)
  }

  dynamo.waitFor('tableExists', { TableName: def.TableName }, callback)
}

async.each(tableDefinitions, function (tableDefinition, callback) {
  dynamo.createTable(tableDefinition, function (err, data) {
    handleCreate(err, data, tableDefinition, callback)
  })
}, function (err) {
  if (err) {
    console.log('Error creating tables', err)
    throw err;
  } else {
    console.log('Tables created.')
  }
})