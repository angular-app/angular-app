module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-testacular');
  grunt.loadTasks('build');

  // Default task.
  grunt.registerTask('default', ['jshint','build','testacular:unit']);
  grunt.registerTask('build', ['clean','html2js','concat','recess:build','copy:assets']);
  grunt.registerTask('release', ['clean','html2js','uglify','jshint','testacular:unit','concat:index', 'recess:min','copy:assets','testacular:e2e']);

  // Print a timestamp (useful for when watching)
  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  var testacularConfig = function(configFile) {
    var options = {
      configFile: configFile,
      keepalive: true
    };
    if ( process.env.TRAVIS ) {
      options.browsers = ['Firefox'];
    }
    return options;
  };

  // Project configuration.
  grunt.initConfig({
    distdir: 'dist',
    pkg: grunt.file.readJSON('package.json'),
    banner:
    '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
    '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
    ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;\n' +
    ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
    src: {
      js: ['src/**/*.js', '<%= distdir %>/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      html: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      },
      less: ['src/less/stylesheet.less'] // recess:build doesn't accept ** in its file patterns
    },
    clean: ['<%= distdir %>/*'],
    copy: {
      assets: {
        files: [{ dest: '<%= distdir %>', src : '**', expand: true, cwd: 'src/assets/' }]
      }
    },
    testacular: {
      unit: { options: testacularConfig('test/config/unit.js') },
      e2e: { options: testacularConfig('test/config/e2e.js') }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= src.tpl.app %>'],
        dest: '<%= distdir %>/templates/app.js',
        module: 'templates.app'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= src.tpl.common %>'],
        dest: '<%= distdir %>/templates/common.js',
        module: 'templates.common'
      }
    },
    concat:{
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      index: {
        src: ['src/index.html'],
        dest: '<%= distdir %>/index.html',
        options: {
          process: true
        }
      },
      angular: {
        src:['vendor/angular/angular.js'],
        dest: '<%= distdir %>/angular.js'
      },
      mongo: {
        src:['vendor/mongolab/*.js'],
        dest: '<%= distdir %>/mongolab.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    uglify: {
      dist:{
        options: {
          banner: "<%= banner %>"
        },
        src:['<%= src.js %>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      },
      angular: {
        src:['<%= concat.angular.src %>'],
        dest: '<%= distdir %>/angular.js'
      },
      mongo: {
        src:['vendor/mongolab/*.js'],
        dest: '<%= distdir %>/mongolab.js'
      },
      bootstrap: {
        src:['vendor/angular-ui/bootstrap/*.js'],
        dest: '<%= distdir %>/bootstrap.js'
      },
      jquery: {
        src:['vendor/jquery/*.js'],
        dest: '<%= distdir %>/jquery.js'
      }
    },
    recess: {
      build: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css':
          ['<%= src.less %>'] },
        options: {
          compile: true
        }
      },
      min: {
        files: {
          '<%= distdir %>/<%= pkg.name %>.css': ['<%= src.less %>']
        },
        options: {
          compress: true
        }
      }
    },
    watch:{
      files:['<%= src.js %>', '<%= test.unit %>', '<%= src.less =>', '<%= src.tpl %>', '<%= src.html %>'],
      tasks:'default timestamp'
    },
    jshint:{
      files:['grunt.js', '<%= src.js %>', '<%= src.specs %>', '<%= src.scenarios %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

};