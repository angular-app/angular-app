[![Build Status](https://secure.travis-ci.org/angular-app/angular-app.png)](http://travis-ci.org/angular-app/angular-app)

# Installation

## Tools
* Install node.js (requires node.js version >= 0.8.4)
* Install global npm modules: `npm install -g grunt@0.3.x testacular@0.4.x`

## App Server
* Install local dependencies: 

    ```
    cd server
    npm install
    cd ..
    ```

## Client App
* Install local dependencies:

    ```
    cd client
    npm install
    cd ..
    ```

# Building

## Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.
* Build client application: `grunt build` (or `grunt.cmd build` on Windows)

## Configure Server
The server stores its data in a MongoLab database.  You will need to create an account with them -it free: https://mongolab.com/signup/.  Once you have signed up, you will be provided with an API key.  Create a database to use for this application.
* Edit `server/config.js` to set the MongoLab API Key you received and the name of the database you created.
* Run the `server/initDB.js` file to initialize the database with a first admin user (admin@abc.com : changeme).

# Running
## Start the Server
* Run the server with `node server/server.js`
* Browse to the application at [http://localhost:3000]

# Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `build` contains build tasks for Grunt
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application

# Development Process
## Default Build
The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by testacular and need one or more browsers open to actually run the tests.
* `grunt` or `grunt.cmd` (on Windows)
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.
## Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.
## Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

## Building release code
You can build a release version of the app, with minified files.  This task will also run the "end to end" (e2e) tests.
The e2e tests require the server to be started and also one or more browsers open to run the tests.  (You can use the same browsers as for the unit tests.)
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

## Continuous testing
You can have grunt (testacular) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* Run `grunt test-watch`
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].
* Each time a file changes the tests will be run against each browser.