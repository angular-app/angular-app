// NodeUnit tests for the initDB.js module that initializes the DB

var rewire = require('rewire');
var initDB = require('../lib/initDB');
var config = require('../config');

module.exports = {
  setUp: function (callback) {
    callback();
  },
  tearDown: function (callback) {
    callback();
  },

  testInvalidDB: function(test) {
    // override the normal config and change the DB name so it's invalid
    var cfgbad = JSON.parse(JSON.stringify(config));
    cfgbad.security.dbName = "invalidDB";
    initDB.initialize(cfgbad);
    initDB.checkDocument(initDB.usersCollection, initDB.adminUser, function(err, data) {
      test.equals(err, null);
      test.equals(data.message, 'Database not found.');
      test.done();
    });
  },

  testCreateAdminUser: function(test) {
    // checks for and creates admin user if user doesn't exist
    initDB.initialize(config);
    initDB.checkDocument(initDB.usersCollection, initDB.adminUser, function(err, data) {
      test.equals(err, null);
      // validate fields, but ignore password in case users changed it
      if (data.length > 0) {
        test.equals(data[0].email, initDB.adminUser['email']);
        test.equals(data[0].admin, initDB.adminUser['admin']);
        test.equals(data[0].firstName, initDB.adminUser['firstName']);
        test.equals(data[0].lastName, initDB.adminUser['lastName']);
        test.done();
      } else {
        // create user
        initDB.addAdminUser(function(err, data) {
          if (data.message) {
            test.ok(false, "Error " + data.message);
          }
          test.done();
        });
      }
    });
  },

  testCreateDeleteUser: function(test) {
    // deletes users, creates user, and then deletes it again
    var someuser = JSON.parse(JSON.stringify(initDB.adminUser));
    someuser['email'] = "unittest@test.com";
    someuser['firstName'] = "unit";
    someuser['lastName'] = "test";
    initDB.initialize(config);
    initDB.checkDocument(initDB.usersCollection, someuser, function(err, data) {
      // first, delete any existing test user docs
      var handleDeleteResult = function(err, data) {
          //console.log('err is ' + JSON.stringify(err));
          //console.log('data is ' + JSON.stringify(data));
          console.log('Deleted doc ID ' + data._id.$oid);
        };
      for (var i = 0;  i < data.length;  i++) {
        var doc = data[i];
        console.log('doc is ' + JSON.stringify(doc));
        initDB.deleteDocument(initDB.usersCollection, doc._id.$oid, handleDeleteResult);
      }
      initDB.checkDocument(initDB.usersCollection, someuser, function(err, data) {
        // verify that there are no test user docs
        test.equals(err, null);
        test.equals(data.length, 0);
        initDB.createDocument(initDB.usersCollection, someuser, function(err, data) {
          // add a new test user doc
          test.equals(err, null);
          // validate fields of newly created user
          test.equals(data.email, someuser['email']);
          test.equals(data.password, someuser['password']);
          test.equals(data.admin, someuser['admin']);
          test.equals(data.firstName, someuser['firstName']);
          test.equals(data.lastName, someuser['lastName']);
          var docId = data._id.$oid;
          initDB.deleteDocument(initDB.usersCollection, docId, function(err, data) {
            // and delete the document we created
            test.equals(err, null);
            test.equals(data._id.$oid, docId);
            test.done();
          });
        });
      });
    });
  }

};