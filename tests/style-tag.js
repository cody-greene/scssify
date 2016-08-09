'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')

it('supports <style> tags', integration(__dirname + '/util/basic.scss', {
  autoInject: true
}, function (context, done) {
  let applied = context.window.getComputedStyle(context.document.body)
  assert.equal(context.exports.tag.tagName, 'STYLE', 'created <style> element')
  assert.equal(applied.backgroundColor, 'blue', 'background-color changed')
  assert.equal(applied.color, 'red', 'text color changed')
  done()
}))
