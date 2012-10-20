module.exports = function(grunt) {

  // Testacular stuff
  var testacularCmd = process.platform === 'win32' ? 'testacular.cmd' : 'testacular';
  var runTestacular = function(testConfigFile, options) {
      var args = ['start', testConfigFile, '--reporters=dots'].concat(options);
      var done = grunt.task.current.async();
      var child = grunt.utils.spawn({
        cmd: testacularCmd,
        args: args
      }, function(err, result, code) {
        if (code) {
          done(false);
        } else {
          done();
        }
      });
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    };

  grunt.registerTask('test-watch', 'watch file changes and test', function() {
    var options = ['--auto-watch', '--no-single-run'];
    runTestacular('test/config/unit.js', options);
  });

  grunt.registerTask('test', 'run testacular tests', function() {
    var options = ['--single-run', '--no-auto-watch'];
    if (process.env.TRAVIS) {
      options.push('--browsers=Firefox');
    }
    runTestacular('test/config/unit.js', options);
  });

  grunt.registerTask('e2e', 'run testacular e2e tests', function() {
    var options = ['--single-run', '--no-auto-watch'];
    if (process.env.TRAVIS) {
      options.push('--browsers=Firefox');
    }
    runTestacular('test/config/e2e.js', options);
  });
};