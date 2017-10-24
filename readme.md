### scssify2
Browserify transfomer to compile [sass][] stylesheets, and automatically inject `<style>` tags. Correctly informs [watchify][] about any `@imports` and also supports [postcss][] plugins. Sourcemaps are fully supported too!

This module was forked from https://github.com/cody-greene/scssify to add features (mainly https://github.com/cody-greene/scssify/pull/28). If this pull request was merged you're better off using the original "scssify".

> node >= 4.0.0

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

```javascript
const browserify = require('browserify')
const scssify = require('scssify2')
browserify('entry.js')
  .transform(scssify, {
    // Disable/enable <style> injection; true by default
    autoInject: true,

    // Useful for debugging; adds data-href="src/foo.scss" to <style> tags
    autoInject: 'verbose',

    // This can be an object too
    autoInject: {
      verbose: false,

      // If true the <style> tag will be prepended to the <head>
      prepend: false
    },

    // require('./MyComponent.scss').css === '.MyComponent{color:red;background:blue}'
    // autoInject: false, will also enable this
    // pre 1.x.x, this is enabled by default
    export: false,

    // Pass options to the compiler, check the node-sass project for more details
    sass: {
      // See the relevant node-sass documentation
      importer: 'custom-importers.js',

      // This will let the importer state be reset if scssify
      // is called several times within the same process, e.g. by factor-bundle
      // should export a factory function (which returns an importer function)
      // overrides opt.sass.importer
      importerFactory: 'custom-importer-factory.js',

      // Enable both of these to get source maps working
      // "browserify --debug" will also enable css sourcemaps
      sourceMapEmbed: true,
      sourceMapContents: true,

      // This is the default only when opt.sass is undefined
      outputStyle: 'compressed'
    },

    // Configure postcss plugins too!
    // postcss is a "soft" dependency so you may need to install it yourself
    postcss: {
      autoprefixer: {
        browsers: ['last 2 versions']
      }
    },

    // Configure postcss options
    // The object returned by this function will be passed as-is to postcss, 
    // with the exception of "map.inline" and "map.prev" which are controlled
    // according to "sass.sourceMapEmbed"
    postcssOptions: function(file) {
      return {
        from: file,
        to: file
      }
    }
  })
  .bundle()
```

Example config using `package.json`:
```json
{
  "browserify": {
    "transform": [
      ["scssify2", {
        "sass": {
          "outputStyle": "compressed",
          "importerFactory": "custom-importers.js",
          "includePaths": ["node_modules", "bower_components"]
        }
      }],
    ]
  },
}
```

Command line usage:
```
$ browserify MyComponent.js -t scssify >bundle.js
```

[sass]: http://sass-lang.com
[postcss]: https://github.com/postcss/postcss
[watchify]: https://github.com/substack/watchify
