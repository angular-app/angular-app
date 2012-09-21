# Installation

* Install node.js (requires node.js version >= 0.8.4)
* Install global npm modules: `npm install -g grunt@0.3.x testacular@0.2.x`
* Install local dependencies: `npm install`

# Development Process
The default grunt task checks the javascript, runs the unit tests and builds (non-minified) distributable files.

* Build (will run tests): `grunt` (or `grunt.cmd` on Windows).
* Open one or more browsers and point them to `http://localhost:8080`.  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

# Building only
You can run the development build on its own without tests to simply concatenate all the files to the dist folder

* Run `grunt build`

# Building release code
You can build a release version of the app, with minified files.

* Run `grunt release`

# Continuous testing
You can have grunt (testacular) continuously watch for file changes and automatically run all the tests on every change.

* Run `grunt test-watch`
* Open one or more browsers and point them to `http://localhost:8080`.
* Each time a file changes the tests will be run against each browser.

# Folders

* `build` contains build tasks for Grunt
* `lib` contains external dependencies (both for the application and tests)
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources

# Running from the local server

* Install local dependencies for the server:
** `cd server`
** `npm install`
* Run the server with `node server.js`
* Browse to the application at http://localhost:3000

# Proxying the db through the local server

* Change the module dependency in `src/services/services.db.js` to `backendResource` rather than `mongolabResource`
* Run the server (see above)
* Browse to the application at http://localhost:3000
