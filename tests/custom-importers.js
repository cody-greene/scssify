'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')
const importSpy = require('./util/mock-importer').importedFiles
const factory = require('./util/mock-importer-factory')

before(function setup() {
  importSpy.clear()
})

it('loads custom importer files', integration(__dirname + '/util/imports.scss', {
  autoInject: false,
  sass: {
    importer: 'tests/util/mock-importer.js'
  }
}, function (context, done) {
  let files = importSpy.values()
  assert.equal(files.next().value, 'vars', 'import spy was loaded')
  done()
}))

it('loads importer from factory function every time it runs', function (done) {
  // this mimics browserify + factor-bundle calling the transform several times in a single process
  let file = __dirname + '/util/imports.scss'
  let config = {
    autoInject: false,
    sass: {
      importerFactory: 'tests/util/mock-importer-factory.js'
    }
  }
  integration(file, config, function (context, done) {
    integration(file, config, function (context, done) {
      let count = factory.count
      assert.equal(count, 2, 'factory not called expected number of times')
      done()
    })(done)
  })(done)
});