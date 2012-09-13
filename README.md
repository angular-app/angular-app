# Installation

* Install node.js (requires node.js version >= 0.8.4)
* Install global npm modules: `npm install -g grunt testacular`
* Install local dependencies: `npm install`

# Building & testing
The default grunt task checks the javascript, runs the unit tests and builds the distributable files.

* Build (will run tests): `grunt` (or `grunt.cmd` on Windows).
* Open one or more browsers and point them to `http://localhost:8080`.  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

# Continuous testing
You can have grunt (testacular) continuously watch for file changes and automatically run all the tests on every change.

* Run `grunt test-watch`
* Open one or more browsers and point them to `http://localhost:8080`.
* Each time a file changes the tests will be run against each browser.
