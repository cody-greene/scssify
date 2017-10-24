'use strict'
const scssify = require('../../lib')
const jsdom = require('jsdom').jsdom
const fs = require('fs')
const vm = require('vm')
const CLIENT_HELPER_CODE = fs.readFileSync('lib/browser.js', 'utf8')

/**
 * @param {string} src Absolute path to a scss file
 * @param {object} config scssify parameters
 * @param {function} callback(context, assert)
 * @param {function?} prepare(context)
 * @return {function} Pass this to tape('test-name', fn)
 */
function createIntegrationTest(src, config, callback, prepare) {
  if (!config._flags) config._flags = {}
  return function (done) {
    fs.createReadStream(src)
    .on('error', done)
    .pipe(scssify(src, config))
    .on('error', done)
    .once('data', function (transformed) {
      let doc = jsdom()
      let helperModule = {exports: {}}
      let cssModule = {exports: {}}
      vm.runInNewContext(CLIENT_HELPER_CODE, {
        window: doc.defaultView,
        document: doc,
        module: helperModule
      })
      if (prepare) prepare({
        window: doc.defaultView,
        document: doc,
        exports: cssModule.exports
      })
      vm.runInNewContext(transformed.toString(), {
        window: doc.defaultView,
        document: doc,
        module: cssModule,
        require: function (req) {
          if (req === 'scssify2') return helperModule.exports
          throw new Error('sandboxed module: unexpected require(...)')
        }
      })
      callback({
        window: doc.defaultView,
        document: doc,
        exports: cssModule.exports
      }, done)
    })
  }
}

module.exports = createIntegrationTest
