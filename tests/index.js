var test = require('tape');
var run = require('tape-run');

var browserify = require('browserify');
var scssify = require('../');

var tests = [
  {
    name: 'style test',
    entry: __dirname + '/style_test/style_test.js',
    options: {
      autoInject: {
        styleTag: true
      }
    }
  },
  {
    name: 'link test',
    entry: __dirname + '/link_test/link_test.js',
    options: {
      autoInject: {
        styleTag: false
      }
    }
  },
  {
    name: 'sass syntax test',
    entry: __dirname + '/sass_test/sass_test.js',
    options: {}
  },
  {
    name: 'include path test',
    entry: __dirname + '/import_test/import_test.js',
    options: {
      "sass": {
        "includePaths": [__dirname + '/import_test/includes']
      }
    }
  },
  {
    name: 'settings test',
    entry: __dirname + '/settings_test/settings_test.js',
    options: {
      "autoInject": false,
      "sass": {
        'outputStyle': 'expanded',
        'sourceMap': true,
        'sourceMapEmbed': true,
        'sourceMapContents': true,
      }
    }
  }
]

/**
 * Run all the tests.
 */

tests.forEach(function (o) {
  test(o.name, function (t) {
    browserify(o.entry)
      .transform(scssify, o.options)
      .require('./', {expose: 'scssify'})
      .bundle()
      .pipe(run({
        browser: 'phantomjs'
      }))
      .on('error', console.error)
      .on('results', function (results) {
        results.asserts.forEach(function(assert) {
          t.ok(assert.ok, assert.name)
        });
        t.end()
      });
  })
});
