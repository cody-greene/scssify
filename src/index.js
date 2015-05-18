import sass from 'node-sass'
import autoprefix from 'autoprefixer-core'
import tools from 'browserify-transform-tools'
import {merge, omit} from 'lodash'
import path from 'path'

const defaults = {
  'autoInject': {
    'verbose': false,
    'styleTag': false
  },
  'sass': {
    'sourceComments': false,
    'sourceMap': false,
    'sourceMapEmbed': false,
    'sourceMapContents': false,
    'outputStyle': 'compressed'
  },
  'autoprefix': false,
  'rootDir': process.cwd()
}

const MODULE_NAME = path.basename(path.dirname(__dirname))

const Transformer = tools.makeStringTransform(MODULE_NAME, {
    includeExtensions: ['.css', '.sass', '.scss'],
    evaluateArguments: true
}, function(content, opts, done) {
  const {file, config} = opts
  const options = merge({}, defaults, omit(config, '_flags'))
  const {sass: userSassOpts} = options
  delete options.sass
  const sassOpts = merge({}, userSassOpts)
  sassOpts.includePaths = sassOpts.includePaths || []
  sassOpts.includePaths.unshift(path.dirname(file))
  sassOpts.indentedSyntax = /\.sass$/i.test(file)
  sassOpts.file = file
  sassOpts.data = content
  sassOpts.outFile = file

  if (options.autoInject === true) {
    options.autoInject = merge({}, defaults.autoInject)
  }

  if (options.autoprefix === true) {
    options.autoprefix = []
  }

  const relativePath = path.relative(options.rootDir, path.dirname(file))
  const href = path.join(relativePath, path.basename(file))

  sass.render(sassOpts, function (err, result) {
    if (err) return done(new SyntaxError(err.file + ': ' + err.message + ' (' + err.line + ':' + err.column + ')'))
    let out = ''
    const css = options.autoprefix ? autoprefix.process(result.css, {
      browsers: [].concat(options.autoprefix),
      map: {
        inline: sassOpts.sourceMapEmbed,
        prev: result.map.toString()
      }
    }).css : result.css
    const cssString = JSON.stringify(css.toString())
    const cssBase64 = JSON.stringify('data:text/css;base64,' + (new Buffer(css)).toString('base64'))

    if (options.autoInject !== false && typeof options.autoInject === 'object') {
      if (options.autoInject.styleTag) {
        const verbose = options.autoInject.verbose ? `{"href": ${JSON.stringify(href)}}` : '{}'
        out += `module.exports.tag = require('${MODULE_NAME}').createStyle(${cssString}, ${verbose});`
      } else {
        out += `module.exports.tag = require('${MODULE_NAME}').createLink(${cssBase64});`
      }
    }

    out += ` module.exports.css = ${cssString};`

    return done(null, out)
  })
})

export default Transformer
