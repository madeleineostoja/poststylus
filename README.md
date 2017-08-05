# PostStylus
[![NPM version][npm-image]][npm-url] [![NPM downloads][downloads-badge]][npm-url] [![Build Status][travis-image]][travis-url]

PostStylus is a [PostCSS][postcss] adapter for Stylus. It allows you to use any PostCSS plugin as a transparent Stylus plugin, and do custom post-processing of Stylus output.

It loads PostCSS processors into Stylus just before the output CSS is compiled to file.

Inspired by [autoprefixer-stylus][autoprefixer-stylus]

### Contents

- [Install](#install)
- [Usage](#usage)
  - [Gulp](#gulp)
  - [Grunt](#grunt)
  - [Webpack](#webpack)
  - [CLI](#cli)
- [Passing Arguments to Plugins](#passing-arguments-to-plugins)
- [Custom Processing](#custom-processing)
- [Warning Handler](#warning-handler)
- [Asynchronous Processing](#asynchronous-processing)

## Install

```sh
$ npm install --save-dev poststylus
```

## Usage

Use `poststylus` as a regular stylus plugin and pass it an array of PostCSS plugins you have installed, either as strings or functions.

```js
stylus(css).use(poststylus([
  'autoprefixer',
  'rucksack-css'
]))
```

#### Gulp

```js
var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    poststylus = require('poststylus'),
    autoprefixer = require('autoprefixer'),
    rucksack = require('rucksack-css');

gulp.task('stylus', function () {
  gulp.src('style.styl')
    .pipe(stylus({
      use: [
        poststylus([ autoprefixer, rucksack ])
      ]
    }))
    .pipe(gulp.dest('.'))
});

gulp.task('default', ['stylus']);
```

#### Grunt

`grunt-contrib-stylus` doesn't support passing arguments to plugins, so you have to wrap PostStylus in a function and return it

``` js
var postcss = function(){
  return require('poststylus')(['autoprefixer', 'rucksack-css']);
}

module.exports = function(grunt) {

  grunt.initConfig({

    stylus: {
      compile: {
        options: {
          use: [postcss]
        },
        files: {
          'style.css': 'style.styl'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-stylus');

};
```

#### Webpack

Use [stylus-loader][stylus-loader] with PostStylus as a plugin in your webpack.conf.js

```
var poststylus = require('poststylus'),
    webpack = require('webpack');

module: {
  loaders: [
    { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' }
  ]
},
stylus: {
  use: [
    poststylus([ 'autoprefixer', 'rucksack-css' ])
  ]
}
```

If you are using webpack 2, use `LoaderOptionsPlugin` to set options

```
module: {...},
plugins: [
  new webpack.LoaderOptionsPlugin({
    options: {
      stylus: {
        use: [poststylus([ 'autoprefixer', 'rucksack-css' ])]
      }
    }
  })
]
```

#### CLI

To use PostStylus on the Stylus CLI, pass `poststylus` to `--use`, and PostCSS plugins to `--with`:

```sh
$ stylus --use ./node_modules/poststylus --with "['autoprefixer']" --out test.css < test.styl
```

## Passing Arguments to Plugins

If you need to pass arguments to a PostCSS plugin `require()` it and pass that function to PostStylus

```js
var autoprefixer = require('autoprefixer');

stylus(css).use([
  poststylus([
    autoprefixer({ browsers: ['ie 8'] })
  ])
])
```

To pass arguments to PostCSS plugins on the CLI, you'll need to prefix `require()` with `$PWD`, since the `stylus` executable runs globally, while your plugins are (probably) installed locally:

```sh
stylus --use ./node_modules/poststylus --with "[require('${PWD}/node_modules/autoprefixer')({ browsers: ['ie 8'] })]" --out test.css < test.styl
```

## Custom Processing

Do custom post-processing of Stylus output by declaring an on-the-fly PostCSS plugin

```js
var myPostcss = postcss.plugin('custom', function() {
  return function (css) {
    // PostCSS processing here
  };
});

// Pipe it into poststylus
stylus(css).use(poststylus([myPostcss()]));
```

Refer to the [PostCSS Docs][postcss-link] for more on writing plugins.

## Warning Handler

By default, if any of your PostCSS plugins raise a warning it will be displayed using `console.error`. You can override this behaviour by passing a function as the second argument to PostStylus.

```js
stylus(css).use(poststylus([
    'autoprefixer',
    'rucksack-css'
], function(message) {
    console.info(message);
}));
```

## Asynchronous Processing

Unfortunately the Stylus `end` event that PostStylus uses to pass back post-processed CSS doesn't accept a callback, so until [this](https://github.com/stylus/stylus/issues/1698) bug is patched upstream PostStylus cannot work with asynchronous PostCSS processing.

***

MIT © [Sean King](https://twitter.com/seaneking)

[npm-image]: https://badge.fury.io/js/poststylus.svg
[npm-url]: https://npmjs.org/package/poststylus
[downloads-badge]: https://img.shields.io/npm/dm/postcss-responsive-type.svg
[travis-image]: https://travis-ci.org/seaneking/poststylus.svg?branch=master
[travis-url]: https://travis-ci.org/seaneking/poststylus
[postcss]: https://github.com/postcss/postcss
[autoprefixer-stylus]: https://github.com/jenius/autoprefixer-stylus
[stylus-loader]: https://github.com/shama/stylus-loader
