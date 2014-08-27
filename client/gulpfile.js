var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var template = require('gulp-template');
var header = require('gulp-header');
var htmlmin = require('gulp-htmlmin');

var merge = require('merge-stream');
var rimraf = require('rimraf');
var _ = require('lodash');

var karma = require('karma').server;

var package = require('./package.json');

var karmaCommonConf = {
  browsers: process.env.TRAVIS ? ['SL_Chrome', 'SL_Firefox', 'SL_Safari', 'SL_IE_11'] : ['Chrome'],
  customLaunchers: {
    'SL_Chrome': {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Linux',
      version: '36'
    },
    'SL_Firefox': {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Linux',
      version: '31'
    },
    'SL_Safari': {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
    },
    'SL_IE_11': {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  },
  frameworks: ['jasmine'],
  preprocessors: {
    'src/**/*.tpl.html': ['ng-html2js']
  },
  files: [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/angular/angular.js',
    'bower_components/angular-route/angular-route.js',
    'bower_components/angularjs-mongolab/src/angular-mongolab.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'src/**/*.tpl.html',
    'src/**/*.js',
    'test/unit/**/*.spec.js'
  ],
  reporters: process.env.TRAVIS ? ['dots', 'saucelabs'] : ['progress'],
  ngHtml2JsPreprocessor: {
    cacheIdFromPath: function(filepath) {
      //cut off src/common/ and src/app/ prefixes, if present
      //we do this so in directives we can refer to templates in a way
      //that those templates can be served by a web server during dev time
      //without any need to bundle them
      return filepath.replace('src/common/', '').replace('src/app/', '');
    }
  },
  sauceLabs: {
    username: 'pkozlowski',
    accessKey: '173aa66e-43e6-4e34-b873-9cb037b8ae5c',
    testName: 'angular-app tests'
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

  var htmlMinOpts = {
    collapseWhitespace: true,
    conservativeCollapse: true
  };

  return merge(
      gulp.src('src/**/*.js'),
      gulp.src('src/app/**/*.tpl.html').pipe(htmlmin(htmlMinOpts)).pipe(templateCache({standalone: true, module: 'templates.app'})),
      gulp.src('src/common/**/*.tpl.html').pipe(htmlmin(htmlMinOpts)).pipe(templateCache({standalone: true, module: 'templates.common'}))
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
    gulp.src('bower_components/bootstrap-css/css/*.css').pipe(gulp.dest('dist/css')),
    gulp.src('bower_components/bootstrap-css/fonts/*').pipe(gulp.dest('dist/fonts')),
    merge(
      gulp.src('src/assets/**/*.*'),
      gulp.src(['bower_components/angular/angular.js', 'bower_components/angular-route/angular-route.js']).pipe(concat('angular.js')),
      gulp.src('bower_components/angular-bootstrap/ui-bootstrap-tpls.js'),
      gulp.src('bower_components/jquery/dist/jquery.js'),
      gulp.src('bower_components/angularjs-mongolab/src/*.js')
    ).pipe(gulp.dest('dist'))
  );
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

  gulp.watch('src/**/*.js', ['lint', 'build-js']);
  gulp.watch('src/**/*.tpl.html', ['build-js']);
  gulp.watch('src/index.html', ['build-index']);
  gulp.watch('src/assets/**/*.*', ['copy-static']);

});

gulp.task('build', ['copy-static', 'build-index', 'build-js']);
gulp.task('default', ['lint', 'test', 'build']);

/*
TODO:
- watch shouldn't break on errors
- don't uglify / HTML minifiy during watch
- live-reload
 */