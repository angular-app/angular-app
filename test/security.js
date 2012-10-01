var rewire = require('rewire');
var security = rewire('../lib/security');

var config = {
  dbUrl: 'https://api.mongolab.com/api/1/databases',
  apiKey: '4fb51e55e4b02e56a67b0b66',
  dbName: 'ascrum',
  usersCollection: 'users'
};

function mockUpPassport(test) {
  var spies = { };
  security.__set__('passport', {
    use: function(fn) {
      spies.useCalled = true;
    },
    authenticate: function() {
      spies.authenticateCalled = true;
      return function() {};
    }
  });
  return spies;
}

function mockUpMongoStrategy(test) {
  var strategy = function(dbUrl, apiKey, dbName, usersCollection) {
    test.equal(dbUrl, config.dbUrl);
    test.equal(apiKey, config.apiKey);
    test.equal(dbName, config.dbName);
    test.equal(usersCollection, config.usersCollection);
  };
  strategy.name = 'mongo';
  security.__set__('MongoStrategy', strategy);
}

module.exports = {
  initialize: function(test) {
    mockUpMongoStrategy(test);
    var passportSpy = mockUpPassport(test);
    security.initialize(config.dbUrl, config.apiKey, config.dbName, config.usersCollection);
    test.ok(passportSpy.useCalled);
    test.done();
  },

  authRequired: function(test) {
    // Setup mocks
    var req = {};
    var res = {
      send: function() { sendCalled = true; }
    };
    var nextCalled = false;
    var sendCalled = false;
    var next = function() { nextCalled = true; };

    // Test when user is unauthenticated
    req.isAuthenticated = function() { return false; };
    security.authRequired(req, res, next);
    test.ok(sendCalled);

    // Test when user is authenticated
    req.isAuthenticated = function() { return true; };
    security.authRequired(req, res, next);
    test.ok(nextCalled);

    test.done();
  },

  sendCurrentUser: function(test) {
    var sendCalled = false;
    var req = { user : {} };
    var res = {
      send: function(user) {
        test.equal(user, req.user);
        sendCalled = true;
      }
    };
    security.sendCurrentUser(req, res, null);
    test.ok(sendCalled);
    test.done();
  },

  login: function(test) {
    var req = {};

    var sendCalled = false;
    var res = {
      send: function() { sendCalled = true; }
    };

    var nextCalled = false;
    var next = function() { nextCalled = true; };

    var spies = mockUpPassport(test, {}, {}, {});
    security.login(req, res, next);
    test.ok(spies.authenticateCalled);
    test.done();
  },

  logoutPOST: function(test) {
    var logoutCalled = false;
    var req = {
      method: 'POST',
      logout: function() {
        logoutCalled = true;
      }
    };
    var redirectCalled = false;
    var sendCalled = false;
    var res = {
      redirect: function() {
        redirectCalled = true;
      },
      send: function() {
        sendCalled = true;
      }
    };
    // Test without POST
    security.logout(req, res);
    test.ok(logoutCalled);
    test.ok(!redirectCalled);
    test.ok(sendCalled);
    test.done();
  }
};