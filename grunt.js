/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'server.js', 'lib/*.js', 'test/**/*.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default timestamp'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: { require: false, __dirname: false, console: false, module: false, exports: false }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });
};
