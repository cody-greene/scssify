'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')

it('supports indented syntax (.sass)', integration(__dirname + '/util/indented.sass', {
  // empty
}, function (context, done) {
  let applied = context.window.getComputedStyle(context.document.body)
  assert.equal(context.exports.tagName, 'STYLE', 'created <style> element')
  assert.equal(applied.backgroundColor, 'blue', 'background-color changed')
  assert.equal(applied.color, 'red', 'text color changed')
  done()
}))
