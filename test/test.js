/*eslint no-unused-vars: 0 */
'use strict';

var chai = require('chai'),
    should = chai.should(),
    fs = require('fs'),
    path = require('path'),
    stylus = require('stylus'),
    poststylus = require('../index'),
    postcss = require('postcss'),
    parse = require('css-parse');

// path to test input/output files
var testPath = path.join(__dirname, 'fixtures');

// dummy postcss plugin to test with, finds decleration 'foo:' and removes it
var testPlugin = postcss.plugin('test', function (filter) {
    return function (css) {
        css.eachDecl(filter || 'foo', function (decl) {
            decl.removeSelf();
        });
    };
});

// matching function to test if input stylus = expected output css
var matchExpected = function(file, plugin, done) {
  return stylus(fs.readFileSync(path.join(testPath, file), 'utf8'))
    .use(poststylus(plugin))
    .render(function(err, css) {

      // if it can't render exit immediately
      if (err) {
        return done(err);
      }

      // set up css test file
      var expected = fs.readFileSync(path.join(
        testPath,
        file.replace('.styl', '.css')),
        'utf8'
      );

      // processed output should === css test file
      parse(css).should.eql(parse(expected));

    return done();

  });
};

// start the tests
describe('PostStylus', function() {

  it('works', function(done) {
    return matchExpected('plugin.styl', testPlugin(), done);
  });

  it('stays alive when not given plugins', function(done) {
    return matchExpected('untouched.styl', '', done);
  });

  it('returns correct sourcemaps', function(done) {

    // stylus input file to test
    var filename = path.join(testPath, 'plugin.styl');

    // define stylus processing
    var style = stylus(fs.readFileSync(filename, 'utf8'))
        .set('filename', filename)
        .set('sourcemap', true)
        .use(poststylus(testPlugin()));

    // see what gets returned
    return style.render(function(err, css) {

      // if error drop out straight away
      if (err) {
        return done(err);
      }

      // sourcemap checks
      style.sourcemap.should.be.an('object');
      style.sourcemap.sources[0].should.equal('stylus');
      style.sourcemap.version.should.equal(3);
      style.sourcemap.mappings.should.equal('AAAA;EACE,YAAA');

      // aaand we're done
      return done();
    });

  });

});
