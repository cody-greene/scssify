var gulp        = require('gulp');
var test        = require('tape');
var run         = require('tape-run');
var spec        = require('tap-spec');
var browserify  = require('browserify');
var changed     = require('gulp-changed');
var babel       = require('gulp-babel');
var eslint      = require('gulp-eslint');
var eventstream = require('event-stream')

var conf = {
  js:     ['./src/*.js', './src/**/*.js'],
  entry: ['./src/index.js', './src/browser.js'],
  dist:   './lib/'
};

gulp.task('transpile', function () {
  return gulp.src(conf.entry)
             .pipe(changed(conf.dist))
             .pipe(babel())
             .pipe(gulp.dest(conf.dist));
});


gulp.task('lint', function () {
  return gulp.src(conf.js)
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('test', function () {
  var stream = test.createStream()
      .pipe(spec())
      .pipe(process.stdout);

  require('./tests');

  return stream;
})

gulp.task('watch', function() {
  gulp.watch(conf.js, ['lint', 'transpile']);
});

gulp.task('build', ['lint', 'transpile'])

gulp.task('default', ['build'])
