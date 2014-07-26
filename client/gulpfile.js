var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var template = require('gulp-template');
var header = require('gulp-header');

var merge = require('merge-stream');
var rimraf = require('rimraf');
var _ = require('lodash');

var karma = require('karma').server;

var package = require('./package.json');

var karmaCommonConf = {
  browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
  frameworks: ['jasmine'],
  preprocessors: {
    'src/**/*.tpl.html': ['ng-html2js']
  },
  files: [
    'vendor/jquery/jquery.js',
    'vendor/angular/angular.js',
    'vendor/angular/angular-route.js',
    'vendor/mongolab/mongolab-resource.js',
    'test/vendor/angular/angular-mocks.js',
    'vendor/angular-ui/**/*.js',
    'src/**/*.tpl.html',
    'src/**/*.js',
    'test/unit/**/*.spec.js'
  ],
  ngHtml2JsPreprocessor: {
    cacheIdFromPath: function(filepath) {
      //cut off src/common/ and src/app/ prefixes, if present
      //we do this so in directives we can refer to templates in a way
      //that those templates can be served by a web server during dev time
      //without any need to bundle them
      return filepath.replace('src/common/', "").replace('src/app/', '');
    }
  }
};


gulp.task('build-index', function () {
  return gulp.src('src/index.html')
    .pipe(template({
      pkg: package,
      year: new Date()
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function () {

  var now = new Date();

  return merge(
      gulp.src('src/**/*.js'),
      gulp.src('src/app/**/*.tpl.html').pipe(templateCache({standalone: true, module: 'templates.app'})),
      gulp.src('src/common/**/*.tpl.html').pipe(templateCache({standalone: true, module: 'templates.common'}))
    ).pipe(concat(package.name + '.js'))
    .pipe(uglify())
    .pipe(header(
        '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= buildDate %>\n' +
        '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
        ' * Copyright (c) <%= copyrightYear %> <%= pkg.author %>;\n' +
        ' * Licensed <%= pkg.licenses[0].type %>\n */\n',
      {
        pkg: package,
        buildDate: now,
        copyrightYear: now.getFullYear()
      }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-static', function () {
  return merge(
    gulp.src('src/assets/**/*.*'),
    gulp.src(['vendor/angular/angular.js', 'vendor/angular/angular-route.js']).pipe(concat('angular.js')),
    gulp.src('vendor/angular-ui/bootstrap/*.js'),
    gulp.src('vendor/jquery/*.js'),
    gulp.src('vendor/mongolab/*.js')
  ).pipe(gulp.dest('dist'));
});

gulp.task('clean', function (done) {
  return rimraf('dist', done);
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', 'test/unit/**/*.js']).pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
  karma.start(_.assign({}, karmaCommonConf, {singleRun: true}), done);
});

gulp.task('tdd', function (done) {
  karma.start(karmaCommonConf, done);
});

gulp.task('watch', ['lint', 'build'], function () {

  gulp.watch('src/**/*.js', ['lint', 'build']);
  gulp.watch('src/index.html', ['build-index']);
  gulp.watch('src/index.html', ['build-index']);
  gulp.watch('src/assets/**/*.*', ['copy-static']);

});

gulp.task('build', ['copy-static', 'build-index', 'build-js']);
gulp.task('default', ['lint', 'test', 'build']);

/*
TODO:
- watch shouldn't break on errors
- minify HTML
- don't uglify during watch
- live-reload
 */