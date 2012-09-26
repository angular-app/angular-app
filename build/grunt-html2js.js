module.exports = function (grunt) {

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