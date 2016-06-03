### scssify
Browserify transfomer to compile [sass][] stylesheets, and automatically inject `<link>` or `<style>` tags. Correctly informs [watchify][] about any `@imports` and also supports [postcss][] plugins.

> node >= 4.0.0

[![npm version](https://badge.fury.io/js/scssify.svg)](https://badge.fury.io/js/scssify) [![Build Status](https://travis-ci.org/cody-greene/scssify.svg?branch=master)](https://travis-ci.org/cody-greene/scssify) [![Dependency Status](https://david-dm.org/cody-greene/scssify.svg)](https://david-dm.org/cody-greene/scssify) [![devDependency Status](https://david-dm.org/cody-greene/scssify/dev-status.svg)](https://david-dm.org/cody-greene/scssify#info=devDependencies)

#### Example
```css
/* MyComponent.scss */
.MyComponent {
  color: red;
  background: blue;
}
```

```javascript
// MyComponent.js
require('./MyComponent.scss') // or .sass, or .css
console.log('MyComponent background is blue')
```

#### Settings
The default settings are listed below.

```javascript
const browserify = require('browserify')
const scssify = require('scssify')
browserify('entry.js')
  .transform(scssify, {
    // Disable auto-injection entirely with autoInject: false
    autoInject: { // auto-inject a <link> tag by default
      verbose: false, // add data-href path to the file when styleTag is used
      styleTag: false // use a <style> tag instead
    },

    // require('./MyComponent.scss').css === '.MyComponent{color:red;background:blue}'
    // autoInject: false, will also enable this
    // pre 1.x.x, this is enabled by default
    export: false,

    // Pass options to the compiler, check the node-sass project for more details
    sass: {
      importer: 'custom-importers.js',

      // This will let the importer state be reset if scssify
      // is called several times within the same process, e.g. by factor-bundle
      // should export a factory function (which returns an importer function)
      importerFactory: 'custom-importer-factory.js',

      sourceComments: false,
      sourceMap: false,
      sourceMapEmbed: false,
      sourceMapContents: false,
      outputStyle: 'compressed'
    },

    rootDir: process.cwd(),

    // Configure postcss plugins too! (no default)
    postcss: {
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    }
  })
  .bundle()
```

Command line usage:
```
$ browserify MyComponent.js -t scssify >bundle.js
```

[sass]: http://sass-lang.com
[postcss]: https://github.com/postcss/postcss
[watchify]: https://github.com/substack/watchify
