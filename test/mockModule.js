'use strict';
var path = require('path'),
    postcss = require('postcss');

var fake = function() {
  var mocks = require(path.join(__dirname, 'mocks'));
  var deps = { postcss: postcss };

  return mocks(deps).plugin;
};

module.exports = fake;
