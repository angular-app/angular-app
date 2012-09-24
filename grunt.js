module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-recess');

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg:'<json:package.json>',
    meta:{
      banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    src: {
      js: ['src/**/*.js', 'dist/tmp/**/*.js'],
      html: ['src/index.html'],
      tpl: ['src/**/*.tpl.html'],
      less: ['src/modules/*/less/*.less'] // recess:build doesn't accept ** in its file patterns
    },
    test: {
      js: ['test/modules/**/*.js']
    },
    lint:{
      files:['grunt.js', '<config:src.js>', '<config:test.js>']
    },
    html2js: {
      src: ['<config:src.tpl>'],
      base: 'src/modules',
      dest: 'dist/tmp'
    },
    concat:{
      dist:{
        src:['<banner:meta.banner>', '<config:src.js>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['lib/angular/angular.js'],
        dest: '<%= distdir %>/angular.js'
      },
      mongo: {
        src:['lib/mongolab/*.js'],
        dest: '<%= distdir %>/mongolab.js'
      }
    },
    min: {
      dist:{
        src:['<banner:meta.banner>', '<config:src.js>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<config:concat.angular.dest>'],
        dest: '<%= distdir %>/angular.js'
      },
      mongo: {
        src:['<config:concat.mongo.dest>'],
        dest: '<%= distdir %>/mongolab.js'
      }
    },
    recess: {
      build: {
        src: ['<config:src.less>'],
        dest: '<%= distdir %>/<%= pkg.name %>.css',
        options: {
          compile: true
        }
      },
      min: {
        src: ['<config:src.less>'],
        dest: '<config:recess.build.dest>',
        options: {
          compress: true
        }
      }
    },
    watch:{
      files:['<config:src.js>', '<config:test.js>', '<config:src.less>', '<config:src.tpl>', '<config:src.html>'],
      tasks:'default'
    },
    jshint:{
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true
      },
      globals:{}
    },
    uglify:{}
  });

  // Default task.
  grunt.registerTask('default', 'build lint test');
  grunt.registerTask('build', 'html2js concat recess:build index');
  grunt.registerTask('release', 'html2js min lint test recess:min index');

  // Testacular stuff
  var testacularCmd = process.platform === 'win32' ? 'testacular.cmd' : 'testacular';
  var testConfigFile = 'test-config.js';
  var runTestacular = function(cmd, options) {
      var args = [cmd, testConfigFile].concat(options);
      var done = grunt.task.current.async();
      var child = grunt.utils.spawn({cmd:testacularCmd, args:args}, function (err, result, code) {
        if ( code ) {
          done(false);
        } else {
          done();
        }
  });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  };

  grunt.registerTask('test-watch', 'watch file changes and test', function() {
    var options = ['--auto-watch', '--reporter=dots', '--no-single-run'];
    runTestacular('start', options);
  });

  grunt.registerTask('test', 'run testacular tests', function () {
    var options = ['--single-run', '--no-auto-watch', '--reporter=dots'];
    if (process.env.TRAVIS) {
      options.push('--browsers=Firefox');
      }
    runTestacular('start', options);
    });

  // HTML stuff
  grunt.registerTask('index', 'Process index.html', function(){
     grunt.file.copy('src/index.html', 'dist/index.html', {process:grunt.template.process});
  });

  // Scaffolding !!
  grunt.registerTask('module', 'create new module', function () {
    var moduleName = this.args[0];
    grunt.log.debug("Creating new module: " + moduleName);
    var srcPath = 'src/modules/' + moduleName + '/';
    var testPath = 'test/modules/' + moduleName + '/';
    var tplvars = {
      module : moduleName,
      ctrl : moduleName.slice(0,1).toUpperCase() + moduleName.slice(1) + 'Ctrl'
    };


    //main module file
    grunt.file.write(srcPath + moduleName + '.js', grunt.template.process(grunt.file.read('build/scaffolding/module.js'), tplvars));
    //partials
    grunt.file.write(srcPath + 'partials/' + moduleName + '.tpl.html', grunt.template.process(grunt.file.read('build/scaffolding/partial.tpl.html'), tplvars));
    //tests
    grunt.file.write(testPath + '/unit/' + moduleName + 'Spec.js', grunt.template.process(grunt.file.read('build/scaffolding/test.js'), tplvars));
  });



  // HTML-2-JS Templates
  var path = require('path');
  var TPL = 'angular.module("<%= id %>", []).run(["$templateCache", function($templateCache) {\n  $templateCache.put("<%= id %>",\n    "<%= content %>");\n}]);\n';
  var templateModule = "angular.module('templates', [<%= templates %>]);";
  var escapeContent = function(content) {
    return content.replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n    "');
  };
  var normalizePath = function(p) {
    if ( path.sep !== '/' ) {
      p = p.replace(/\\/g, '/');
    }
    return p;
  };

  grunt.registerTask('html2js', 'Generate js version of html template.', function() {
    this.requiresConfig('html2js.src');
    var files = grunt.file.expandFiles(grunt.config.process('html2js.src'));
    var base = grunt.config.process('html2js.base') || '.';
    var dest = grunt.config.process('html2js.dest') || '.';
    var templates = [];
    files.forEach(function(file) {
      var id = normalizePath(path.relative(base, file));
      templates.push("'" + id + "'");
      grunt.file.write(path.resolve(dest, id + '.js'), grunt.template.process(TPL, {
        id: id,
        content: escapeContent(grunt.file.read(file))
      }));
    });
    grunt.file.write(path.resolve(dest,'templates.js'), grunt.template.process(templateModule, {
      templates: templates.join(', ')
    }));
  });
};