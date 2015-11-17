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
    }),
    // Dummy postcss plugin to test with, raises a warning if 'shouldWarn' is true
    warn: deps.postcss.plugin('warn', function (shouldWarn) {
        return function (css, result) {
            if (shouldWarn){
                result.warn('A warning was raised');
            }
        };
    })
  };

};

module.exports = exports;
