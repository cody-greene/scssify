'use strict'
/* eslint-env mocha */
const assert = require('assert')
const integration = require('./util/integration')

it('settings', integration(__dirname + '/util/basic.scss', {
  autoInject: false,
  sass: {
    outputStyle: 'expanded'
  },
  postcss: {
    autoprefixer: {}
  }
}, function (context, done) {
  let css = context.exports
  assert.equal(typeof css, 'string', 'exported raw css')
  assert.notEqual(css.indexOf('-webkit'), -1, 'postcss plugins ran')
  done()
}))
