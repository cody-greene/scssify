# scssify #

Browserify transfomer to compile [Sass](http://sass-lang.com) styles and optionally inject them into the browser.

[![Dependency Status](https://david-dm.org/chrishoage/scssify.svg)](https://david-dm.org/chrishoage/scssify) [![devDependency Status](https://david-dm.org/chrishoage/scssify/dev-status.svg)](https://david-dm.org/davidguttman/sassify#info=devDependencies)


# Example

MyComponent.scss:
``` css
.MyComponent {
  color: red;
  background: blue;
}
```

MyComponent.js:
``` js
require('./MyComponent.scss');

console.log('MyComponent background is blue')
```

Indented Sass syntax may be used with the `.sass` extension:
``` js
require('./MyComponent.sass');
```

Install scssify:

```
$ npm i scssify
```

## Settings
The default settings are listed below. They may be overridden though the CLI, package.json (`scssify` property)
or though the API options.

``` js
  var browserify = require('browserify');
  var scssify = require('scssify');
  browserify('entry.js')
    .transform(scssify, {
      'autoInject': { //autoInject may be set to true to use defaults
        'verbose': false, //verbose adds data-href path to the file when styleTag is used
        'styleTag': false //When styleTag is false, a <link> tag is used
      },
      //To turn off autoInject, set autoInject to false
      //'autoInject': false,
      'sass': { //Full sass options
        'sourceComments': false,
        'sourceMap': false,
        'sourceMapEmbed': false,
        'sourceMapContents': false,
        'outputStyle': 'compressed'
      },
      'autoprefix': false,
      //you may specify what browsers to auto prefix here
      //'autoprefix': ['last 2 versions'],
      'rootDir': process.cwd()
    })
    .bundle()
````

# Install

[![scssify](https://nodei.co/npm/scssify.png?small=true)](https://nodei.co/npm/scssify)

#Development

  1. Clone the repo
  2. `npm install`
  3. `npm run dev`

This project uses Babel to transpile ES6 to ES5.

# License

[MIT](/LICENSE)
