
'use strict';

var exports = function(deps) {
  return {
    // dummy postcss plugin to test with, finds decleration 'foo:' and removes it
    plugin: deps.postcss.plugin('test', function (filter) {
      return function (css) {
          css.eachDecl(filter || 'foo', function (decl) {
              decl.removeSelf();
          });
      };
    })
  };
};

module.exports = exports;
