'use strict'
const merge = Object.assign
const path = require('path')
const postcss = require('postcss')
const resolve = require('resolve')
const sass = require('node-sass')
const TransformStream = require('stream').Transform

const CWD = process.cwd()
const TARGET_FILE_EXT = /\.(css|scss|sass)$/
const MODULE_NAME = path.basename(path.dirname(__dirname))
const DEFAULT_CONFIG = {
  autoInject: {
    verbose: false,
    styleTag: false
  },
  export: false,
  sass: {
    sourceComments: false,
    sourceMap: false,
    sourceMapEmbed: false,
    sourceMapContents: false,
    outputStyle: 'compressed'
  },
  postcss: false,
  rootDir: CWD
}

function scssify(file, content, config, stream, done) {
  const options = merge({}, DEFAULT_CONFIG, config)
  const sassOpts = merge({}, options.sass)
  sassOpts.includePaths = sassOpts.includePaths || []
  sassOpts.includePaths.unshift(path.dirname(file))
  sassOpts.indentedSyntax = /\.sass$/i.test(file)
  sassOpts.file = file
  sassOpts.data = content
  sassOpts.outFile = file

  if (typeof sassOpts.importer === 'string') {
    sassOpts.importer = require(path.resolve(sassOpts.importer))
  }
  else if (typeof sassOpts.importerFactory === 'string') {
    let factory = require(path.resolve(sassOpts.importerFactory))
    sassOpts.importer = factory()
  }

  if (options.autoInject === true) {
    options.autoInject = merge({}, DEFAULT_CONFIG.autoInject)
  }

  if (options.postcss !== false && !(typeof options.postcss === 'object')) {
    return done(new Error('Postcss config must be false or an object of plugins'))
  }

  const relativePath = path.relative(options.rootDir, path.dirname(file))
  const href = path.join(relativePath, path.basename(file))

  const postcssTransforms = options.postcss ? Object.keys(options.postcss).map((pluginName) => {
    const pluginOpts = options.postcss[pluginName]
    const plugin = require(resolve.sync(pluginName, {basedir: CWD}))
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

    if (options.export || !options.autoInject) {
      out += ` module.exports.css = ${cssString};`
    }

    emitDependencies(stream, result.stats.includedFiles)
    stream.push(out)
    done()
  })
}

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

module.exports = function (file, config) {
  if (!file.match(TARGET_FILE_EXT)) return through()
  return collect(function (content, done) {
    scssify(file, content.toString('utf8'), config, this, done)
  })
}

/**
 * @param {function} flush(bufferedContent, done)
 * @return {DuplexStream}
 */
function collect(flush) {
  let buf = []
  return through(function (chunk, enc, next) {
    buf.push(chunk)
    next()
  }, function (done) {
    flush.call(this, Buffer.concat(buf), done)
  })
}

/**
 * Quickly create a object-mode duplex stream
 * @param {function?} transform(chunk, encoding, done)
 * @param {function?} flush(done)
 * @param {boolean} objectMode
 * @return {DuplexStream}
 */
function through(transform, flush, objectMode) {
  const stream = new TransformStream({objectMode})
  stream._transform = transform || pass
  if (flush) stream._flush = flush
  return stream
}

function pass(chunk, _, done) {
  done(null, chunk)
}
