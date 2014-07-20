var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodeunit = require('gulp-nodeunit');

gulp.task('lint', function () {
  return gulp.src(['server.js', 'lib/*.js', 'test/**/*.js']).pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function () {
  gulp.src('test/**/*.js').pipe(nodeunit());
});

gulp.task('supervise', function (done) {
  require('supervisor').run(['server.js']);
});

gulp.task('default', ['lint']);
