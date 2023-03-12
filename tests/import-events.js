'use strict'
/* eslint-env mocha */
const assert = require('assert')
const fs = require('fs')
const scssify = require('../lib')

it('emits "file" events for @imports', function (done) {
  const entry = __dirname + '/util/imports-old.scss'
  const expectedImport = [
    __dirname + '/util/imports-old.scss',
    __dirname + '/util/_vars.scss',
  ]
  let index = 0
  fs.createReadStream(entry)
  .on('error', done)
  .pipe(scssify(entry, {_flags: {}}))
  .on('error', done)
  .on('file', function (imported) {
    assert.equal(imported, expectedImport[index++])
  })
  .on('end', done)
  .resume()
})
