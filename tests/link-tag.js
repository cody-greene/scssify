'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')

it('supports <link> tags', integration(__dirname + '/util/basic.scss', {
  autoInject: {
    styleTag: false
  }
}, function (context, done) {
  let applied = context.window.getComputedStyle(context.document.body)
  assert.equal(context.exports.tag.tagName, 'LINK', 'created <link> element')
  assert.equal(applied.backgroundColor, 'blue', 'background-color changed')
  assert.equal(applied.color, 'red', 'text color changed')
  done()
}))
