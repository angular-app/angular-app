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
        //TODO: add a copyright notice
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint:{
      files:['grunt.js', 'src/**/*.js', 'test/unit/**/*.js']
    },
    concat:{
      dist:{
        src:['<banner:meta.banner>', 'src/**/*.js'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      }
    },
    min:{
      dist:{
        src:['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest:'<%= distdir %>/<%= pkg.name %>.min.js'
      }
    },
    recess: {
      build: {
        src: ['src/modules/*/less/*.less'],
        dest: '<%= distdir %>/<%= pkg.name %>.css',
        options: {
          compile: true
        }
      },
      min: {
        src: '<config:recess.build.dest>',
        dest: '<%= distdir %>/<%= pkg.name %>.min.css',
        options: {
          compress: true
        }
      }
    },
    watch:{
      files:['<config:lint.files>', 'src/**/*.html'],
      tasks:'lint test concat min concatPartials index'
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
  grunt.registerTask('default', 'lint test concat  min recess:build recess:min concatPartials index');

  // Testacular stuff
  var testacularCmd = process.platform === 'win32' ? 'testacular.cmd' : 'testacular';
  var testConfigFile = 'test/config/test-config.js';
  var runTestacular = function(cmd, options) {
      var args = [cmd, testConfigFile].concat(options);
      var done = grunt.task.current.async();
      var child = grunt.utils.spawn({cmd:testacularCmd, args:args}, function (err, result, code) {
        if (code) {
          grunt.fail.fatal("Test failed...");
        }
        done(!code);
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

  grunt.registerTask('concatPartials', 'concat partials', function () {
    //TODO: horrible implementation, to be fixed, but this Grunt task makes sense for the AngularJS community!
    var content = '', partials = grunt.file.expandFiles('src/modules/*/partials/**/*.tpl.html');
    for (var i=0; i<partials.length; i++){
      var partialFile = partials[i];
      var partialel = partialFile.split('/');
      var partial = "<script type='text/ng-template' id='"+partialel[partialel.length-1]+"'>"+grunt.file.read(partialFile)+"</script>\n";
      content += partial;
    }
    grunt.file.write('dist/partials.tpl.html', content);
  });

  // Scaffolding !!
  grunt.registerTask('module', 'create new module', function () {
    var moduleName = this.args[0];
    grunt.log.debug("Creating new module: " + moduleName);
    var srcPath = 'src/modules/' + moduleName + '/';
    var testPath = 'test/modules/' + moduleName + '/';

    //js
    //main module file
    grunt.file.write(srcPath + moduleName + '.js', "angular.module('" + moduleName + "',[]);\nangular.module('" + moduleName + "').controller('" + moduleName + "Controller', function($scope){\n});");
    //tests
    grunt.file.write(testPath + '/unit/' + moduleName + 'Spec.js', "//jasmine template here");
    //partials
    grunt.file.write(srcPath + 'partials/' + moduleName + '.tpl.html', '<div>' + moduleName + '</div>');
  });
};