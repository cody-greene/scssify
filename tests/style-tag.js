'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')

it('supports <style> tags', integration(__dirname + '/util/basic.scss', {
  autoInject: true
}, function (context, done) {
  let applied = context.window.getComputedStyle(context.document.body)
  assert.equal(context.exports.tagName, 'STYLE', 'created <style> element')
  assert.equal(applied.backgroundColor, 'blue', 'background-color changed')
  assert.equal(applied.color, 'red', 'text color changed')
  done()
}))

it('can prepend to the <head>', integration(__dirname + '/util/basic.scss', {
  autoInject: {prepend: true}
}, function (ctx, done) {
  let children = ctx.document.head.childNodes
  let dummy = children[1]
  assert.equal(children.length, 2)
  assert.equal(dummy.id, 'foo')
  done()
}, function (ctx) {
  let dummy = ctx.document.createElement('style')
  dummy.id = 'foo'
  ctx.document.head.appendChild(dummy)
}))
