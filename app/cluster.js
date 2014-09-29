'use strict';

require('dotenv').load();

var workers = process.env.NODE_WORKERS || 0
if (workers == 0) {
  require('./app');
}
else {
  var cluster = require('cluster');

  if (workers < 0) {
    workers = require('os').cpus().length;
  }

  if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < workers; i++) {
      cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
      console.log('worker %d died (%s)', worker.process.pid, signal || code);

      // start a new child.
      cluster.fork();
    });
  }
  else {
    require('./app');
  }
}
