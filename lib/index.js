'use strict'
const merge = require('lodash/object/merge')
const omit = require('lodash/object/omit')
const path = require('path')
const postcss = require('postcss')
const resolve = require('resolve')
const sass = require('node-sass')
const tools = require('browserify-transform-tools')

const defaults = {
  autoInject: {
    verbose: false,
    styleTag: false
  },
  sass: {
    sourceComments: false,
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed'
  },
  postcss: false,
  rootDir: process.cwd()
}

const MODULE_NAME = path.basename(path.dirname(__dirname))

const Transformer = tools.makeStringTransform(MODULE_NAME, {
  includeExtensions: ['.css', '.sass', '.scss'],
  evaluateArguments: true
}, function (content, opts, done) {
  const stream = this
  const file = opts.file
  const config = opts.config
  const options = merge({}, defaults, omit(config, '_flags'))
  const sassOpts = merge({}, options.sass)
  sassOpts.includePaths = sassOpts.includePaths || []
  sassOpts.includePaths.unshift(path.dirname(file))
  sassOpts.indentedSyntax = /\.sass$/i.test(file)
  sassOpts.file = file
  sassOpts.data = content
  sassOpts.outFile = file

  if (options.autoInject === true) {
    options.autoInject = merge({}, defaults.autoInject)
  }

  if (options.postcss !== false && !(typeof options.postcss === 'object')) {
    return done(new Error('Postcss config must be false or an object of plugins'))
  }

  const relativePath = path.relative(options.rootDir, path.dirname(file))
  const href = path.join(relativePath, path.basename(file))

  const postcssTransforms = options.postcss ? Object.keys(options.postcss).map((pluginName) => {
    const pluginOpts = options.postcss[pluginName]
    const plugin = require(resolve.sync(pluginName, {basedir: process.cwd()}))
    return plugin(pluginOpts)
  }) : null

  sass.render(sassOpts, function (err, result) {
    if (err) return done(new SyntaxError(err.file + ': ' + err.message + ' (' + err.line + ':' + err.column + ')'))
    let out = ''
    const css = options.postcss ? postcss(postcssTransforms).process(result.css, {
      map: {
        inline: sassOpts.sourceMapEmbed,
        prev: sassOpts.sourceMapEmbed ? result.map.toString() : null
      }
    }).css : result.css
    const cssString = JSON.stringify(css.toString())
    const cssBase64 = JSON.stringify('data:text/css;base64,' + (new Buffer(css)).toString('base64'))

    if (options.autoInject !== false && typeof options.autoInject === 'object') {
      if (options.autoInject.styleTag) {
        const verbose = options.autoInject.verbose ? `{"href": ${JSON.stringify(href)}}` : '{}'
        out += `module.exports.tag = require('${MODULE_NAME}').createStyle(${cssString}, ${verbose});`
      }
      else {
        out += `module.exports.tag = require('${MODULE_NAME}').createLink(${cssBase64});`
      }
    }

    out += ` module.exports.css = ${cssString};`

    emitDependencies(stream, result.stats.includedFiles)
    return done(null, out)
  })
})

/**
 * Let browserify/watchify know about nested imports
 * Without these events watchify will not rebundle when a "@imported" file is changed
 * @param {EventEmitter} stream
 * @param {string[]} deps
 */
function emitDependencies(stream, deps) {
  for (let index = 0; index < deps.length; ++index)
    stream.emit('file', deps[index])
}

module.exports = Transformer
