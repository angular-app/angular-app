module.exports = function(grunt) {

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

};