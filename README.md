[![Build Status](https://secure.travis-ci.org/angular-app/angular-app.png)](http://travis-ci.org/angular-app/angular-app)

# Installation

## Tools
Our development process and back end server rely on applications written in NodeJS (nodejs.org).  You need to install NodeJS and then the development tools.
NodeJs comes with a package manager called npm for installing NodeJS applications and libraries.
* Install node.js (requires node.js version >= 0.8.4) - [http://nodejs.org/download/]
* Install Grunt and Testacular as global npm modules:

    ```
    npm install -g grunt@0.3.x testacular@0.4.x
    ```

## App Server
Our backend application server is a NodeJS application that relies upon some 3rd Party libraries.  You need to install these using the NodeJS package manager, npm 
* Install local dependencies: 

    ```
    cd server
    npm install
    cd ..
    ```

## Client App
Our client application is a straight HTML/Javascript application but our development process uses a NodeJS build tool called Grunt [gruntjs.com].  Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.
* Install local dependencies:

    ```
    cd client
    npm install
    cd ..
    ```

# Building

_*If you are using Windows then you must run `grunt` as `grunt.cmd`.  Throughout the rest of this README we will just write `grunt`.*_

## Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application: `grunt build`

## Configure Server
The server stores its data in a MongoLab database.
* Create an account at MongoLab - it's free: [https://mongolab.com/signup/].
* Create a database to use for this application: [https://mongolab.com/newdb]
* Grab your API key: [https://mongolab.com/user?username=YOUR_USERNAME_HERE]
* Edit `server/config.js` to set your MongoLab API Key and the name of the database you created.

    ```
    mongo: {
        dbUrl: 'https://api.mongolab.com/api/1/databases',  // The base url of the MongoLab DB server
        apiKey: 'YOUR_API_KEY_HERE',                        // Our MongoLab API key
        dbName: 'YOUR_DB_NAME_HERE',                        // The name of database to which this server connect
        usersCollection: 'users'                            // The name of the collection that will contain our user information
    },
    ```

* Run our initialization script to initialize the database with a first admin user (admin@abc.com : changeme).

    ```
    `node server/initDB.js`
    ```

# Running
## Start the Server
* Run the server
    ```
    node server/server.js
    ```
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

* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].
* Each time a file changes the tests will be run against each browser.