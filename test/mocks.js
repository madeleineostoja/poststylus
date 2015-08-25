'use strict';

var exports = function(deps) {

  return {
    // Dummy postcss plugin to test with, finds decleration 'foo:' and removes it
    plugin: deps.postcss.plugin('test', function (filter) {
      return function (css) {
          css.walkDecls(filter || 'foo', function (decl) {
              decl.remove();
          });
      };
    })
  };

};

module.exports = exports;
