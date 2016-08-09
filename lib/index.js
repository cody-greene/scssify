'use strict'
const merge = Object.assign
const path = require('path')
const resolve = require('resolve')
const sass = require('node-sass')
const TransformStream = require('stream').Transform
const CWD = process.cwd()
const TARGET_FILE_EXT = /\.(css|scss|sass)$/
const MODULE_NAME = path.basename(path.dirname(__dirname))
const DEFAULT_CONFIG = {
  autoInject: true,
  sass: {
    outputStyle: 'compressed'
  },
  rootDir: CWD
}

function scssify(file, content, config, stream, done) {
  const options = merge({}, DEFAULT_CONFIG, config)
  const sassOpts = merge({}, options.sass)
  let postcss = null
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
    sassOpts.importer = require(path.resolve(sassOpts.importerFactory))()
  }
  if (options.postcss && typeof options.postcss !== 'object') {
    return done(new Error('postcss config must be false or an object of plugins'))
  }
  if (options.postcss) try {
    postcss = require('postcss')
  }
  catch (err) {
    return done(new Error('postcss is missing; npm install --save postcss'))
  }
  const relativePath = path.relative(options.rootDir, path.dirname(file))
  const href = path.join(relativePath, path.basename(file))
  const postcssTransforms = options.postcss ? Object.keys(options.postcss).map((pluginName) => {
    const pluginOpts = options.postcss[pluginName]
    const plugin = require(resolve.sync(pluginName, {basedir: CWD}))
    return plugin(pluginOpts)
  }) : null
  sass.render(sassOpts, function (err, result) {
    if (err) done(new SyntaxError(err.formatted))
    else if (options.postcss) {
      postcss(postcssTransforms).process(result.css, {
        map: {
          inline: sassOpts.sourceMapEmbed,
          prev: sassOpts.sourceMapEmbed ? result.map.toString() : null
        }
      }).then(generateModule).catch(done)
    }
    else generateModule(result)
    function generateModule(result) {
      const cssString = JSON.stringify(result.css.toString())
      let out = ''
      if (options.autoInject) {
        const verbose = options.autoInject === 'verbose' ? JSON.stringify({href}) : '{}'
        out += `module.exports.tag = require('${MODULE_NAME}').createStyle(${cssString}, ${verbose});`
      }
      if (options.export || !options.autoInject) {
        out += `module.exports.css = ${cssString};`
      }
      emitDependencies(stream, result.stats.includedFiles)
      stream.push(out)
      done()
    }
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
