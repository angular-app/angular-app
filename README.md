[![Build Status](https://secure.travis-ci.org/angular-app/angular-app.png)](http://travis-ci.org/angular-app/angular-app)

# [AngularJS](http://www.angularjs.org/) CRUD application demo

***

## Purpose

The idea is to **demonstrate how to write a typical, non-trivial [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) application using AngularJS**. To showcase AngularJS in its most advantageous environment we've set out to write a simplified project management tool supporting teams using the [SCRUM](http://en.wikipedia.org/wiki/Scrum_(software_development)) methodology. The sample application tries to show best practices when it comes to: folders structure, using modules, testing, communicating with a REST back-end, organizing navigation, addressing security concerns (authentication / authorization).

This sample application is featured in our [book](http://goo.gl/gKEsIo) where you can find detailed description of the patterns and techniques used to write this code:

<a href="http://goo.gl/gKEsIo"><img src="http://www.packtpub.com/sites/default/files/1820OS.jpg"></a>

We've learned a lot while using and supporting AngularJS on the [mailing list](https://groups.google.com/group/angular) and would like to share our experience.

## Stack

* Persistence store: [MongoDB](http://www.mongodb.org/) hosted on [MongoLab](https://mongolab.com/)
* Backend: [Node.js](http://nodejs.org/)
* Awesome [AngularJS](http://www.angularjs.org/) on the client
* CSS based on [Bootstrap](http://getbootstrap.com/)

### Build

It is a complete project with a build system focused on AngularJS apps and tightly integrated with other tools commonly used in the AngularJS community:
* powered by [gulp.js](http://gulpjs.com/)
* test written using [Jasmine](http://jasmine.github.io/) syntax
* test are executed by [Karma Test Runner](http://karma-runner.github.io/) (integrated with the gulp.js build)
* build supporting JS, CSS and AngularJS templates minification
* [Travis-CI](https://travis-ci.org/) integration

## Installation

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install gulp and Karma runner as global npm modules:

    ```
    npm install -g gulp karma
    ```

### Get the Code

Either clone this repository or fork it on GitHub and clone your fork:

```
git clone https://github.com/angular-app/angular-app.git
cd angular-app
```

### App Server

Our backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies (from the project root folder):

    ```
    cd server
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the server/package.json file)

### Client App

Our client application is a straight HTML/Javascript application but our development process uses a Node.js build tool
[gulp.js](gulpjs.com). gulp relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies (from the project root folder):

    ```
    cd client
    npm install
    cd ..
    ```

  (This will install the dependencies declared in the client/package.json file)

## Building

### Configure Server
The server stores its data in a MongoLab database.
* Create an account at MongoLab - it's free: [https://mongolab.com/signup/].
* Create a database to use for this application: [https://mongolab.com/create]
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

* Optionally change the name of admin user in `server/lib/initDB.js`.  The default is 'Admin' (admin@abc.com : changeme). 

    ```
    var initDB = {
      adminUser: { email: 'admin@abc.com', password: 'changeme', admin: true, firstName: 'Admin', lastName: 'User' },
    });
    // Note the user information, including password, are stored as plain text in the MongoLab database.
    ```

* Run our initialization script to initialize the database with a first admin user (admin@abc.com : changeme).

    ```
    node server/initDB.js
    ```

### Configure Client
The client specifies the name of the MongoDB to use in `client/src/app/app.js`.  If your DB is not called "ascrum" then you need to change the MONGOLAB_CONFIG constant:

```
angular.module('app').constant('MONGOLAB_CONFIG', {
  baseUrl: '/databases/',
  dbName: 'ascrum'
});
```

### Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the gulp build tool to do this.
* Build client application:

    ```
    cd client
    gulp
    cd ..
    ```

*It is important to build again if you have changed the client configuration as above.*

## Running
### Start the Server
* Run the server

    ```
    cd server
    node server.js
    cd ..
    ```
* Browse to the application at [http://localhost:3000]
* Login with the admin user as defined in `server/lib/initDB.js`. 

## Browser Support
We only regularly test against Chrome 29 and occasionally against Firefox and Internet Explorer.
The application should run on most modern browsers that are supported by the AngularJS framework.
Obviously, if you chose to base your application on this one, then you should ensure you do your own
testing against browsers that you need to support.

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `node_modules` contains build tasks for gulp along with other, user-installed, Node packages
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies
* `vendor` contains external dependencies for the application

### Default Build
The default gulp task will build (checks the javascript (`lint`), runs the unit tests (`test``) and builds distributable files:
* `cd client`
* `gulp`

### Continuous Building
The watch gulp task will monitor the source files and run the default build task every time a file changes: `gulp watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `gulp build`.

### Continuous testing
You can have gulp (karma) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* `cd client`
* Run `gulp tdd`. In the default configuration it will start a new instance of Chrome.
* The task will wait for code changes, re-executing tests on each change.