var MongoDBStrategy = require('../lib/mongo-strategy');

var db;
var config = {
  dbUrl: 'https://api.mongolab.com/api/1/databases',
  apiKey: '4fb51e55e4b02e56a67b0b66'
};

module.exports = {
  setUp: function(callback) {
    db = new MongoDBStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users');
    callback();
  },
  testGet: function(test) {
    db.get('5054bb33e4b024584b8f3419', function(err, result) {
      test.ok(!err);
      test.ok(result);
      test.equal(result.email, 'pete@bacondarwin.com');
      test.done();
    });
  },
  testQuery: function(test) {
    db.findByEmail('pete@bacondarwin.com', function(err, result) {
      test.ok(!err);
      console.log(result);
      test.ok(result[0]);
      test.equal(result[0].email, 'pete@bacondarwin.com');
      test.done();
    });
  }
};