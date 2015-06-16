# PostStylus
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

PostStylus is a [PostCSS](https://github.com/postcss/postcss) adapter for Stylus. With it you can use any PostCSS plugin as a transparent Stylus plugin. Neato!

Inspired by [autoprefixer-stylus](https://github.com/jenius/autoprefixer-stylus)

--

### Install

```sh
$ npm install --save poststylus
```

--

### Usage

Just use `poststylus` as a regular stylus plugin and pass it an array of postcss plugins, like this:
```js
stylus(css).use(poststylus([
  // your postcss plugins here
]))
```


###### Gulp:
```js
var gulp = require('gulp'),
    stylus = require('gulps-stylus'),
    poststylus = require('poststylus');

// PostCSS plugins we want to apply
var postcssPlugins = [
    require('autoprefixer')(),
    require('postcss-position')(),
    require('lost')
];

gulp.task('stylus', function () {
  gulp.src('style.styl')
    .pipe(stylus({
      use: [
        poststylus(postcssPlugins)
      ]
    }))
    .pipe(gulp.dest('.'))
});

gulp.task('default', ['stylus']);
```

  
###### Grunt:
``` js
module.exports = function(grunt) {
  
  // PostCSS plugins we want to apply
  var postcssPlugins = [
    require('autoprefixer')(),
    require('postcss-position')(),
    require('lost')
  ];

  grunt.initConfig({

    stylus: {
      compile: {
        options: {
          use: [
             poststylus(postcssPlugins)
          ]
        },
        files: {
          'style.css': 'style.styl'
        }
      }
    }

  });

  grunt.registerTask('default', ['stylus']);

};
```

-- 

### License

MIT © [Sean King](http://simpla.io)


[npm-image]: https://badge.fury.io/js/poststylus.svg
[npm-url]: https://npmjs.org/package/poststylus
[travis-image]: https://travis-ci.org/seaneking/poststylus.svg?branch=master
[travis-url]: https://travis-ci.org/seaneking/poststylus
[daviddm-image]: https://david-dm.org/seaneking/poststylus.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/seaneking/poststylus
