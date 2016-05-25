'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')
const importSpy = require('./util/mock-importer').importedFiles

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
