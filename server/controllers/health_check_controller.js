'use strict';

const rev = require('../rev.json');
const pkg = require('../../package.json');

exports.get = function (req, res) {
  res.json(200, {
    version: pkg.version,
    rev: rev.rev,
    built: rev.built
  });
};
