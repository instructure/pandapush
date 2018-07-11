const statsd = require("../statsd");

module.exports = () => {
  return function(req, res, next) {
    const start = Date.now();

    const done = function() {
      res.removeListener("close", done);
      res.removeListener("finish", done);

      const duration = Date.now() - start;
      statsd.increment("responses.all." + res.statusCode);
      statsd.timing("duration.all", duration);
    };

    res.on("finish", done);
    res.on("close", done);

    next();
  };
};
