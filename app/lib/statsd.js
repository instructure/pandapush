const Lynx = require('lynx');

const host = process.env.STATSD_HOST || 'localhost';
const port = process.env.STATSD_PORT || 8125;
const prefix = process.env.STATSD_PREFIX || 'pandapush';

const instance = new Lynx(host, port, { scope: prefix });

exports.count = instance.count.bind(instance);
exports.increment = instance.increment.bind(instance);
exports.decrement = instance.decrement.bind(instance);
exports.timing = instance.timing.bind(instance);
exports.set = instance.set.bind(instance);
exports.send = instance.send.bind(instance);
exports.gauge = instance.gauge.bind(instance);
