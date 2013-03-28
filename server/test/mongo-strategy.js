var rewire = require("rewire");
var MongoDBStrategy = rewire('../lib/mongo-strategy');

var config = {
  dbUrl: 'https://api.mongolab.com/api/1',
  dbName: 'ascrum',
  dbCollection: 'users',
  apiKey: '4fb51e55e4b02e56a67b0b66',
  testId : '5054bb33e4b024584b8f3419',
  testUser: { _id: { '$oid': '5054bb33e4b024584b8f3419' },
    lastName: 'Bloggs',
    firstName: 'Jo',
    login: 'jo',
    email: 'jo@bloggs.com',
    password: 'XX'
  }
};


// This method uses the rewire technology to override the local variable "rest" in the test subject
// so that we don't have to actually call out to the server - Yay!!
function mockupRestInterface(test, expectedUrl, expectedOptions, expectedEvent, expectedResult) {
  MongoDBStrategy.__set__('rest', {
    get: function(url, options, callback) {
      test.equal(url, expectedUrl, 'rest.get fn received invalid parameter');
      test.deepEqual(options, expectedOptions, 'rest.get fn received invalid parameter');
      callback(null, null, expectedResult);
    }
  });
}

var baseUrl = config.dbUrl + '/databases/' + config.dbName + '/collections/' + config.dbCollection + '/';
  
module.exports = {
  testGet: function(test) {
    mockupRestInterface(test, baseUrl + config.testId, { json: {}, qs: { apiKey: config.apiKey }}, 'success', config.testUser);

    var db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    db.get(config.testId, function(err, result) {
      test.ok(!err);
      test.ok(result);
      test.equal(result.email, 'jo@bloggs.com');
      test.done();
    });
  },

  testFindByEmail_found: function(test) {
    var db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    mockupRestInterface(test, baseUrl, { json: {}, qs: { apiKey: config.apiKey, q: JSON.stringify({email:"jo@bloggs.com"}) }}, 'success', [config.testUser]);
    db.findByEmail('jo@bloggs.com', function(err, result) {
      test.ok(!err);
      test.ok(result !== null);
      test.equal(result.email, 'jo@bloggs.com');
      test.done();
    });

  },

  testFindByEmail_notfound: function(test) {
    var db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    mockupRestInterface(test, baseUrl, { json: {}, qs: { apiKey: config.apiKey, q: JSON.stringify({email:"jo@bloggs.com"}) }}, 'success', []);
    db.findByEmail('jo@bloggs.com', function(err, result) {
      test.ok(!err);
      test.ok(result === null);
      test.done();
    });
  },
  
  testVerifyUser: function(test) {
    mockupRestInterface(test, baseUrl, { json: {}, qs: { apiKey: config.apiKey, q: JSON.stringify({email:"jo@bloggs.com"}) }}, 'success', [config.testUser]);
    var db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    db.verifyUser('jo@bloggs.com', 'XX', function(err, user) {
      test.ok(!err);
      test.ok(user);
      test.done();
    });
  }
};