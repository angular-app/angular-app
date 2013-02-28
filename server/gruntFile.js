/*global module*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Project configuration.
  grunt.initConfig({
    nodeunit: ['test/**/*.js'],
    watch: {
      files: '<config:lint.files>',
      tasks: 'default timestamp'
    },
    jshint: {
      files: ['grunt.js', 'server.js', 'lib/*.js', 'test/**/*.js'],
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
        eqnull: true,
        globals: { require: false, __dirname: false, console: false, module: false, exports: false }
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint','nodeunit']);

  grunt.registerTask('timestamp', function() {
    grunt.log.subhead(Date());
  });

  grunt.registerTask('supervise', function() {
    this.async();
    require('supervisor').run(['server.js']);
  });
};
