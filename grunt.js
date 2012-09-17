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
    src: {
      js: ['src/**/*.js'],
      html: ['src/index.html'],
      tpl: ['src/**/*.tpl.html'],
      less: ['src/modules/*/less/*.less'] // recess:build doesn't accept ** in its file patterns
    },
    test: {
      js: ['test/**/*/js']
    },
    lint:{
      files:['grunt.js', '<config:src.js>', '<config:test.js>']
    },
    html2js: { tpl: '<config:src.tpl>' },
    concat:{
      dist:{
        src:['<banner:meta.banner>', '<config:src.js>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
      }
    },
    min:{
      dist:{
        src:['<banner:meta.banner>', '<config:src.js>'],
        dest:'<%= distdir %>/<%= pkg.name %>.js'
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
      files:['<config:src.js>', '<config:test.js>', '<config:src.less>', 'src/modules/*/partials/**/*.tpl.html', 'src/index.html'], //need to have a path to index.html, otherwise watch won't pick it up
      tasks:'build'
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
  grunt.registerTask('build', 'html2js concat recess:build concatPartials index');
  grunt.registerTask('release', 'lint test min recess:min concatPartials index');

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
      var partialEls = partialFile.split('/');
      var moduleName = partialEls[2];
      var partialName = partialEls[partialEls.length-1];
      var partial = "<script type='text/ng-template' id='"+moduleName+"/"+partialName+"'>"+grunt.file.read(partialFile)+"</script>\n";
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
  var TPL = 'angular.module("<%= file %>", []).run(function($templateCache) {\n' +
      '  $templateCache.put("<%= file %>",\n    "<%= content %>");\n' +
      '});\n';

  var escapeContent = function(content) {
    return content.replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n    "');
  };

  grunt.registerMultiTask('html2js', 'Generate js version of html template.', function() {
    var files = grunt._watch_changed_files || grunt.file.expand(this.data);

    files.forEach(function(file) {
      grunt.file.write(file + '.js', grunt.template.process(TPL, {
        file: file,
        content: escapeContent(grunt.file.read(file))
      }));
    });
  });
};