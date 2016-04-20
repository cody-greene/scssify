'use strict'
/* eslint-env mocha */
const assert = require('assert')
const fs = require('fs')
const scssify = require('../lib')

it('emits "file" events for @imports', function (done) {
  const entry = __dirname + '/util/imports.scss'
  const expectedImport = __dirname + '/util/_vars.scss'
  fs.createReadStream(entry)
  .on('error', done)
  .pipe(scssify(entry, {}))
  .on('error', done)
  .on('file', function (imported) {
    assert.equal(imported, expectedImport)
  })
  .on('end', done)
  .resume()
})
