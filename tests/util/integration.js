'use strict'
const scssify = require('../../lib')
const JSDOM = require('jsdom').JSDOM
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
      let doc = new JSDOM(null, {runScripts: 'dangerously'})
      let helperModule = {exports: {}}
      let cssModule = {exports: {}}
      vm.runInNewContext(CLIENT_HELPER_CODE, {
        window: doc.window,
        document: doc.window.document,
        module: helperModule
      })
      if (prepare) prepare({
        window: doc.window,
        document: doc.window.document,
        exports: cssModule.exports
      })
      vm.runInNewContext(transformed.toString(), {
        window: doc.window,
        document: doc.window.document,
        module: cssModule,
        require: function (req) {
          if (req === 'scssify') return helperModule.exports
          throw new Error('sandboxed module: unexpected require(...)')
        }
      })
      callback({
        window: doc.window,
        document: doc.window.document,
        exports: cssModule.exports
      }, done)
    })
  }
}

module.exports = createIntegrationTest
