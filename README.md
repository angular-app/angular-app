[![Build Status](https://secure.travis-ci.org/angular-app/angular-app.png)](http://travis-ci.org/angular-app/angular-app)

# Installation

* Install node.js (requires node.js version >= 0.8.4)
* Install global npm modules: `npm install -g grunt@0.3.x testacular@0.4.x`
* Install local dependencies: `npm install`

# Running the application
    * `grunt build` (or `grunt.cmd` build on Windows)
* Build application sources

* Install local dependencies for the server:
    * `cd [server folder]`
    * `npm install`
* Run the server with `node server.js`
* Browse to the application at http://localhost:3000

# Folders structure

* `build` contains build tasks for Grunt
* `lib` contains external dependencies for the application
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies

# Development Process
The default grunt task checks the javascript, runs the unit tests and builds (non-minified) distributable files.

* Build (will run tests): `grunt` (or `grunt.cmd` on Windows).
* Open one or more browsers and point them to `http://localhost:8080/__testacular/`.  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

## Building only
You can run the development build on its own without tests to simply concatenate all the files to the dist folder

* Run `grunt build`

## Building release code
You can build a release version of the app, with minified files.

* Run `grunt release`

## Continuous testing
You can have grunt (testacular) continuously watch for file changes and automatically run all the tests on every change.

* Run `grunt test-watch`
* Open one or more browsers and point them to `http://localhost:8080/__testacular/`.
* Each time a file changes the tests will be run against each browser.