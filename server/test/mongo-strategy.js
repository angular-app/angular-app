var rewire = require("rewire");
var MongoDBStrategy = rewire('../lib/mongo-strategy');

var db;
var config = {
  dbUrl: 'https://api.mongolab.com/api/1/databases',
  dbName: 'ascrum',
  dbCollection: 'users',
  apiKey: '4fb51e55e4b02e56a67b0b66',
  testId : '5054bb33e4b024584b8f3419',
  testUser: { _id: { '$oid': '5054bb33e4b024584b8f3419' },
    lastName: 'Bloggs',
    firstName: 'Jo',
    login: 'jo',
    email: 'jo@bloggs.com'
  }
};


// This method uses the rewire technology to override the local variable "rest" in the test subject
// so that we don't have to actually call out to the server - Yay!!
function mockupRestInterface(test, expectedUrl, expectedOptions, expectedEvent, expectedResult) {
  MongoDBStrategy.__set__('rest', {
    get: function(url, options) {
      test.equal(url, expectedUrl, 'rest.get fn received invalid parameter');
      test.deepEqual(options, expectedOptions, 'rest.get fn received invalid parameter');
      return {
        on: function(eventString, callback) {
          if ( eventString === expectedEvent ) {
            callback(expectedResult);
          }
        }
      };
    }
  });
}

var baseUrl = config.dbUrl + '/' + config.dbName + '/collections/' + config.dbCollection + '/';
  
module.exports = {
  testGet: function(test) {
    mockupRestInterface(test, baseUrl + config.testId, { query: { apiKey: config.apiKey }}, 'success', config.testUser);

    db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    db.get(config.testId, function(err, result) {
      test.ok(!err);
      test.ok(result);
      test.equal(result.email, 'jo@bloggs.com');
      test.done();
    });
  },
  testQuery: function(test) {
    mockupRestInterface(test, baseUrl, { query: { apiKey: config.apiKey, q: JSON.stringify({email:"jo@bloggs.com"}) }}, 'success', [config.testUser]);

    db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');

    db.findByEmail('jo@bloggs.com', function(err, result) {
      test.ok(!err);
      test.ok(result[0]);
      test.equal(result[0].email, 'jo@bloggs.com');
      test.done();
    });
  }
};