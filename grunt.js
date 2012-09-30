module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
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
      tpl: ['src/app/**/*.tpl.html'],
      less: ['src/less/stylesheet.less'] // recess:build doesn't accept ** in its file patterns
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: {'<%= distdir %>/': 'assets/**'}
      }
    },
    test: {
      unit: ['test/unit/**/*.js']
    },
    lint:{
      files:['grunt.js', '<config:src.js>', '<config:test.unit>']
    },
    html2js: {
      src: ['<config:src.tpl>'],
      base: 'src/app',
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
        src:['<config:concat.angular.src>'],
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
      files:['<config:src.js>', '<config:test.unit>', '<config:src.less>', '<config:src.tpl>', '<config:src.html>'],
      tasks:'default timestamp'
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
  grunt.registerTask('default', 'build lint test:unit');
  grunt.registerTask('build', 'clean html2js concat recess:build index copy');
  grunt.registerTask('release', 'clean html2js min lint test recess:min index copy e2e');

  // HTML stuff
  grunt.registerTask('index', 'Process index.html', function(){
     grunt.file.copy('src/index.html', 'dist/index.html', {process:grunt.template.process});
  });

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

};