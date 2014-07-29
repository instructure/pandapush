var lynx = require('lynx');

var host = process.env.STATSD_HOST || 'localhost',
    port = process.env.STATSD_PORT || 8125,
    prefix = process.env.STATSD_PREFIX || "pandapush",
    hostname = "";

if (process.env.HOSTNAME) {
  hostname = "." + process.env.HOSTNAME;
}

console.log("hostname: " + hostname);

var instance = new lynx(host, port, { scope: prefix });

exports.count     = instance.count.bind(instance);
exports.increment = instance.increment.bind(instance);
exports.decrement = instance.decrement.bind(instance);
exports.timing    = instance.timing.bind(instance);
exports.set       = instance.set.bind(instance);
exports.send      = instance.send.bind(instance);

// gauges need to include something to differentiate the hosts from each other,
// since their values need to be combined at graphite query time.
exports.gauge = function(name, val, sample) {
  instance.gauge(name + hostname, val, sample);
};
