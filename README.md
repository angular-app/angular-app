[![Build Status](https://secure.travis-ci.org/angular-app/angular-app.png)](http://travis-ci.org/angular-app/angular-app)

# [AngularJS](http://www.angularjs.org/) CRUD application demo

***

## Purpose

The idea is to **demonstrate how to write a typical, non-trivial CRUD application using AngularJS**. To showcase AngularJS in its most advantageous environment we've set out to write a simplified project management tool supporting teams using the SCRUM methodology. The sample application tries to show best practices when it comes to: folders structure, using modules, testing, communicating with a REST back-end, organizing navigation, addressing security concerns (authentication / authorization).

We've learned a lot while using and supporting AngularJS on the [mailing list](https://groups.google.com/group/angular) and would like to share our experience.

## Stack

* Persistence store: [MongoDB](http://www.mongodb.org/) hosted on [MongoLab](https://mongolab.com/)
* Backend: [Node.js](http://nodejs.org/)
* Awesome [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Twitter's bootstrap](http://twitter.github.com/bootstrap/)

### Build

It is a complete project with a build system focused on AngularJS apps and tightly integrated with other tools commonly used in the AngularJS community:
* powered by [Grunt.js](http://gruntjs.com/)
* test written using [Jasmine](http://pivotal.github.com/jasmine/) syntax
* test are executed by [Testacular](http://vojtajina.github.com/testacular/) (integrated with the Grunt.js build)
* build supporting JS, CSS and AngularJS templates minification
* [Twitter's bootstrap](http://twitter.github.com/bootstrap/) with LESS templates processing integrated into the build
* [Travis-CI](https://travis-ci.org/) integration

## Installation

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Testacular as global npm modules:

    ```
    npm install -g grunt-cli testacular@0.4.x
    ```

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies:

    ```
    cd server
    npm install
    cd ..
    ```

### Client App

Our client application is a straight HTML/Javascript application but our development process uses a Node.js build tool
[Grunt.js](gruntjs.com). Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies:

    ```
    cd client
    npm install
    cd ..
    ```

## Building

_*If you are using Windows then you must run `grunt` as `grunt.cmd`.  Throughout the rest of this README we will just write `grunt`.*_

### Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application: `grunt build`

### Configure Server
The server stores its data in a MongoLab database.
* Create an account at MongoLab - it's free: [https://mongolab.com/signup/].
* Create a database to use for this application: [https://mongolab.com/newdb]
* Grab your API key: [https://mongolab.com/user?username=YOUR_USERNAME_HERE]
* Edit `server/config.js` to set your MongoLab API Key and the name of the database you created.

    ```
    mongo: {
        dbUrl: 'https://api.mongolab.com/api/1',    // The base url of the MongoLab DB server
        apiKey: 'YOUR_API_KEY_HERE',                // Our MongoLab API key
    },
    security: {
        dbName: 'YOUR_DB_NAME_HERE',                // The name of database that contains the security information
        usersCollection: 'users'                    // The name of the collection contains user information
    },
    ```

* Run our initialization script to initialize the database with a first admin user (admin@abc.com : changeme).

    ```
    `node server/initDB.js`
    ```

### Configure Client
The client specifies the name of the MongoDB to use in `client/src/app/app.js`.  If your DB is not called "ascrum" then you need to change the MONGOLAB_CONFIG constant:

```
angular.module('app').constant('MONGOLAB_CONFIG', {
  baseUrl: 'http://localhost:3000/databases/',
  dbName: 'ascrum'
});
```

## Running
### Start the Server
* Run the server
    ```
    node server/server.js
    ```
* Browse to the application at [http://localhost:3000]

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `build` contains build tasks for Grunt
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application

### Default Build
The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by testacular and need one or more browsers open to actually run the tests.
* `grunt` or `grunt.cmd` (on Windows)
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

### Building release code
You can build a release version of the app, with minified files.  This task will also run the "end to end" (e2e) tests.
The e2e tests require the server to be started and also one or more browsers open to run the tests.  (You can use the same browsers as for the unit tests.)
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous testing
You can have grunt (testacular) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8080/__testacular/].
* Each time a file changes the tests will be run against each browser.
