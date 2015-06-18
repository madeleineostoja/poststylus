'use strict';

var postcss = require('postcss'),
    path = require('path'),
    map = require('multi-stage-sourcemap');

module.exports = function (plugins) {

  // if no plugins are given create an empty array for postcss
  if (!plugins) {
    plugins = [];
  }

  // process plugin, if plugin is a string, requires the package that we assume
  //  that it points to
  var processPlugin = function(plugin) {
    if (typeof plugin === 'string') {
      return require(plugin)();
    }

    return plugin;
  };

  // either process each if its an array, or if its singular, process it
  if (typeof plugins.map !== 'undefined') {
    // It's an array, process each of them
    plugins = plugins.map(processPlugin);
  } else {
    plugins = processPlugin(plugins);
  }

  // return a stylus function with postcss-processing applied
  return function(style) {
    style = this || style;
    var filename = style.options.filename;

    // grab stylus' processed css before it's compiled to file
    style.on('end', function(err, css) {

      // exit on error
      if (err){
        return err;
      }

      // define postcss processing options
      var processOptions = {
        from: filename,
        to: path.join(
          path.dirname(filename),
          path.basename(filename, path.extname(filename))
        ) + '.css'
      };

      // if there is a stylus sourcemap, ensure postcss also generates one
      if (style.sourcemap) {
        processOptions.map = { annotation: false };
      }

      // run postcss with user plugins
      var processed = postcss(plugins).process(css, processOptions);

      // if sourcemaps generated, combine them
      if (processed.map && style.sourcemap) {

        var comboMap = map.transfer({
          fromSourceMap: processed.map.toString(),
          toSourceMap: style.sourcemap
        });

        // and set result as new sourcemap
        style.sourcemap = JSON.parse(comboMap);

      }

      // pipe all postcss errors to the console
      processed.warnings().forEach(console.error);

      // return the postcss-processed css
      return processed.css;

    });



  };
};
