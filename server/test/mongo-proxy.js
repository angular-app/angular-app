var rewire = require('rewire');
var mongoProxyFactory = rewire('../lib/mongo-proxy');
var url = require('url');

var proxy;

var testMapUrl = function(test, request, expected, message) {
  var actual = proxy.mapUrl(request);
  expected = url.parse(expected, true);

  test.equal(actual.protocol, expected.protocol);
  test.equal(actual.hostname, expected.hostname);

  // To test the path we need to parse again to account for order differences in query
  var actualPath = url.parse(actual.path, true);
  var expectedPath = url.parse(expected.path, true);
  test.deepEqual(actualPath.pathname, expectedPath.pathname);
  test.deepEqual(actualPath.query, expectedPath.query);

  test.done();
};

// Mock up the https service
mongoProxyFactory.__set__('https', {
  request: function(options, callback) {
    return { end: function() {} };
  }
});

// Create a proxy to test
proxy = mongoProxyFactory('https://api.mongolab.com/api/1/databases','4fb51e55e4b02e56a67b0b66');

module.exports = {
  factory: {
    testFactory: function(test) {
      test.ok(!!proxy, 'The created proxy is defined.');
      test.done();
    }
  },

  mapUrl : {
    testDatabasesUrl: function(test) {
      testMapUrl(test,
        '/',
        'https://api.mongolab.com/api/1/databases/?apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testCollectionsUrl: function(test) {
      testMapUrl(test,
        '/ascrum/collections',
        'https://api.mongolab.com/api/1/databases/ascrum/collections?apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testUrlMapWithQuery: function(test) {
      testMapUrl(test,
        '/ascrum/collections/users?q=%7B%7D&c=true',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users?q=%7B%7D&c=true&apiKey=4fb51e55e4b02e56a67b0b66');
    },

    testUrlMapWithId: function(test) {
      testMapUrl(test,
        '/ascrum/collections/users/SOME_ID',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users/SOME_ID?apiKey=4fb51e55e4b02e56a67b0b66');
    },
    testUrlMapWithLocalPath: function(test) {
      testMapUrl(test,
        '/ascrum/collections/users/SOME_ID',
        'https://api.mongolab.com/api/1/databases/ascrum/collections/users/SOME_ID?apiKey=4fb51e55e4b02e56a67b0b66');
    }

  },

  mapRequest: {
    testMethod: function(test) {
      var newRequest = proxy.mapRequest({url:'/', method: 'GET'});
      test.equal(newRequest.method, 'GET');
      newRequest = proxy.mapRequest({url:'/', method: 'POST'});
      test.equal(newRequest.method, 'POST');
      newRequest = proxy.mapRequest({url:'/', method: 'HEAD'});
      test.equal(newRequest.method, 'HEAD');
      test.done();
    },
    testHostHeader: function(test) {
      var newRequest = proxy.mapRequest({url:'/', headers: {Host:'localhost:3000'}});
      test.equal(newRequest.headers.host, 'api.mongolab.com');
      test.done();
    },
    testHeaders: function(test) {
      var headers = { Accept:'text/html', 'Cache-Control':'max-age=0', Host:'localhost:3000', Connection:'keep-alive' };
      var newRequest = proxy.mapRequest({url:'/', headers: headers});
      for(var key in newRequest.headers) {
        if(key !== 'Host') { // Host gets modified, see testHostHeader
          test.equal(newRequest.headers[key], headers[key]);
        }
      }
      test.done();
    }
  },
  proxy: {
    checkHttpsRequestOptions: function(test) {
      var req = {
        url: '/ascrum/collections/users?q=%7B%7D&c=true',
        method: 'GET',
        data: ''
      };
      var res = { };

      proxy(req, res);
      test.done();
    },
    nextShouldNotBeCalled: function(test) {
      var req = { url: '', end: function() {} };
      var res = { };
      var next = function() {
        throw new Error('Should not call next.');
      };

      proxy(req, res, next);
      test.done();
    }
  }
};