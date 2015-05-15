import sass from 'node-sass'
import autoprefix from 'autoprefixer-core'
import tools from 'browserify-transform-tools'
import merge from 'object-merge'
import path from 'path'

const defaults = {
    'autoInject': true,
    'autoInjectOptions': {
      'verbose': true,
      'styleTag': true
    },
    'sass': {
      'sourceComments': false,
      'sourceMap': true,
      'sourceMapEmbed': true,
      'sourceMapContents': true
    },
    'autoprefix': true,
    'rootDir': process.cwd()
}

const Transformer = tools.makeStringTransform('scssify', {
    includeExtensions: ['.css', '.sass', '.scss'],
    evaluateArguments: true
}, function(content, opts, done) {
    const {file, config} = opts
    const options = merge({}, defaults, config.options)
    const {sass: userSassOpts} = options
    delete options.sass
    const sassOpts = merge({}, userSassOpts)
    sassOpts.includePaths = sassOpts.includePaths || []
    sassOpts.includePaths.unshift(path.dirname(file))
    sassOpts.indentedSyntax = /\.sass$/i.test(file)
    sassOpts.outputStyle = 'compressed'
    sassOpts.file = file
    sassOpts.data = content
    sassOpts.outFile = file

    const relativePath = path.relative(options.rootDir, path.dirname(file))
    const href = path.join(relativePath, path.basename(file))
    //console.log(options.rootDir, file, href, file.replace(options.rootDir, ''))
    sass.render(sassOpts, function (err, result) {
        if (err) return done(new SyntaxError(err.file+': '+err.message +' ('+err.line+':'+err.column+')'))
        let out = ''
        const css = options.autoprefix ? autoprefix.process(result.css, {
          map: {
            inline: sassOpts.sourceMapEmbed,
            prev: result.map.toString()
          }
        }).css : result.css
        const cssString = JSON.stringify(css.toString())
        const cssBase64 = JSON.stringify('data:text/css;base64,' + (new Buffer(css)).toString('base64'))

        if (options.autoInject) {
          if (options.autoInjectOptions.styleTag) {
            const verbose = options.autoInjectOptions.verbose ? `{"href": ${JSON.stringify(href)}}` : '{}'
            out += `require('${path.basename(path.dirname(__dirname))}').createStyle(${cssString}, ${verbose});`
          } else {
            out += `require('${path.basename(path.dirname(__dirname))}').createLink(${cssBase64});`
          }
        }

        out += ` module.exports = ${cssString};`

        return done(null, out)
    })
})

export default Transformer
