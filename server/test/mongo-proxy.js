var mongoProxyFactory = require('../lib/mongo-proxy');
var url = require('url');

var testMapUrl = function(test, request, expected, message) {
  var actual = mongoProxyFactory('https://api.mongolab.com/api/1','4fb51e55e4b02e56a67b0b66').mapUrl(request);
  expected = url.parse(expected, true);

  test.equal(actual.protocol, expected.protocol);
  test.equal(actual.hostname, expected.hostname);
  test.equal(actual.pathname, expected.pathname);
  test.deepEqual(actual.query, expected.query);
  test.done();
};

var proxy, mockHttps;

module.exports = {
  setUp: function(callback) {
    mockHttps = {
      // We don't want to really make a https request in a unit test!
      request: function(options, callback) {
        console.log('https.request:', options);
        return { end: function() {} };
      }
    };
    proxy = mongoProxyFactory('https://api.mongolab.com/api/1','4fb51e55e4b02e56a67b0b66', mockHttps);
    callback();
  },
  factory: {
    testFactory: function(test) {
      test.ok(!!proxy, 'The created proxy is defined.');
      test.done();
    }
  },
  mapUrl : {
    testDatabasesUrl: function(test) {
      testMapUrl(test,
        'http://localhost:3000/databases',
        'https://api.mongolab.com/api/1/databases?apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testCollectionsUrl: function(test) {
      testMapUrl(test,
        'http://localhost:3000/databases/ascrum/collections',
        'https://api.mongolab.com/api/1/databases/ascrum/collections?apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testUrlMapWithQuery: function(test) {
      testMapUrl(test,
        'http://localhost:3000/databases/ascrum/collections/users?q=%7B%7D&c=true',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users?q=%7B%7D&c=true&apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testUrlMapWithId: function(test) {
      testMapUrl(test,
        'http://localhost:3000/databases/ascrum/collections/users/SOME_ID',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users/SOME_ID?apiKey=4fb51e55e4b02e56a67b0b66');
    },
    testUrlMapWithLocalPath: function(test) {
      testMapUrl(test,
        '/databases/ascrum/collections/users/SOME_ID',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users/SOME_ID?apiKey=4fb51e55e4b02e56a67b0b66');
    }

  },
  proxy: {
    checkHttpsRequestOptions: function(test) {
      var req = {
        originalUrl: 'http://localhost:3000/databases/ascrum/collections/users?q=%7B%7D&c=true',
        method: 'GET',
        data: ''
      };
      var res = { };

      proxy(req, res);
      test.done();
    },
    nextShouldNotBeCalled: function(test) {
      var req = { originalUrl: '', end: function() {} };
      var res = { };
      var next = function() {
        throw new Error('Should not call next.');
      };

      proxy(req, res, next);
      test.done();
    }
  }
};