/*
 * grunt-html2js
 * https://github.com/karlgoldstein/grunt-html2js
 *
 * Copyright (c) 2013 Karl Goldstein
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var path = require('path');

  var escapeContent = function(content) {
    return content.replace(/"/g, '\\"').replace(/\r?\n/g, '" +\n    "');
  };

  // convert Windows file separator URL path separator
  var normalizePath = function(p) {
    if ( path.sep !== '/' ) {
      p = p.replace(/\\/g, '/');
    }
    return p;
  };

  // Warn on and remove invalid source files (if nonull was set).  
  var existsFilter = function(filepath) {

    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else {
      return true;
    }
  };

  // compile a template to an angular module
  var compileTemplate = function(moduleName, filepath) {

    var content = escapeContent(grunt.file.read(filepath));

    var module = 'angular.module("' + moduleName + 
      '", []).run(["$templateCache", function($templateCache) ' +
      '{\n  $templateCache.put("' + moduleName + '",\n    "' +  content + 
      '");\n}]);\n';

    return module;
  };

  grunt.registerMultiTask('html2js', 'Compiles Angular-JS templates to JavaScript.', function() {

    var options = this.options({
      base: 'src',
      module: 'templates-' + this.target
    });

    // generate a separate module
    this.files.forEach(function(f) {

      var moduleNames = [];

      var modules = f.src.filter(existsFilter).map(function(filepath) {

        var moduleName = normalizePath(path.relative(options.base, filepath));
        moduleNames.push("'" + moduleName + "'");

        return compileTemplate(moduleName, filepath);

      }).join(grunt.util.normalizelf('\n'));

      if (moduleNames.length) {

        var target = f.module || options.module;

        var bundle = "angular.module('" + target + "', [" + 
        moduleNames.join(', ') + "]);\n\n" + modules;
        grunt.file.write(f.dest, bundle);
        grunt.log.writeln('File "' + f.dest + '" created.');

      } else {

        grunt.log.warn('No source templates found, not creating ' + f.dest);
      }
    });
  });
};