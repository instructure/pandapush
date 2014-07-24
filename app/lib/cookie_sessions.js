module.exports = function(name) {
  return function(req, res, next) {
    console.log("in cookie session handler");
    req.session = req.signedCookies[name] || {};

    res.on('header', function() {
      console.log("adding cookie session header");
      res.cookie(name, req.session, { signed: true });
    });

    next();
  }
}
