var gulp    = require('gulp');
var changed = require('gulp-changed');
var babel   = require('gulp-babel');
var eslint  = require('gulp-eslint');

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
      .pipe(changed(conf.dist))
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('watch', function() {
  gulp.watch(conf.js, ['lint', 'transpile']);
});

gulp.task('default', ['transpile'])
