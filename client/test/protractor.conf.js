var fs = require('fs');
var path = require('path');

var seleniumFolder = './node_modules/protractor/selenium/';
var jarFilename = fs.readdirSync(seleniumFolder)
                  .filter(function(filename) { return /^selenium/.test(filename); })[0];
var seleniumJarPath = path.resolve(seleniumFolder, jarFilename);
console.log(seleniumJarPath);

exports.config = {
  // The address of a running selenium server.
  seleniumServerJar: seleniumJarPath,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the configuration file location passed
  // to proractor (in this example conf.js).
  // They may include glob patterns.
  specs: ['e2e/**/*.spec.js'],

  baseUrl: 'http://localhost:3000',
  
  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  }
};