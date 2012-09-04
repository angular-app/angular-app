var testacular = require('testacular');

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg:'<json:package.json>',
    meta:{
      banner:'/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        //TODO: add a copyright notice
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint:{
      files:['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    test:{
      files:['test/**/*.js']
    },
    concat:{
      dist:{
        src:['<banner:meta.banner>', 'src/**/*.js'],
        dest:'dist/<%= pkg.name %>.js'
      }
    },
    min:{
      dist:{
        src:['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest:'dist/<%= pkg.name %>.min.js'
      }
    },
    watch:{
      files:'<config:lint.files>',
      tasks:'lint test'
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
  grunt.registerTask('default', 'lint concat min');

  grunt.registerTask('server', 'start testacular server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start('test/config/test-config.js');
  });

  grunt.registerTask('test', 'start testacular test', function () {

    var specDone = this.async();
    var child = grunt.utils.spawn({cmd:'testacular-run.cmd'}, function (err, result, code) {
      if (code) {
        console.error(err);
        grunt.fail.fatal("Test failed...", code);
      } else {
        specDone();
      }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

};
