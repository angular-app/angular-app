module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadTasks('build');

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
        src:['lib/mongolab/*.js'],
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

  // HTML stuff
  grunt.registerTask('index', 'Process index.html', function(){
     grunt.file.copy('src/index.html', 'dist/index.html', {process:grunt.template.process});
  });

};