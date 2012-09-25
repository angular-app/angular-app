var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var rest = require('restler');

function MongoDBStrategy(dbUrl, apiKey, dbName, collection) {
  this.name = "mongo";
  this.dbUrl = dbUrl;
  this.apiKey = apiKey;
  this.dbName = dbName;
  this.collection = collection;
  this.baseUrl = this.dbUrl + '/' + this.dbName + '/collections/' + collection + '/';

  LocalStrategy.call(this, {
    usernameField: 'email'
  }, this.authenticate.bind(this));
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(this.get.bind(this));
}

util.inherits(MongoDBStrategy, LocalStrategy);

MongoDBStrategy.prototype.query = function(query, done) {
  query.apiKey = this.apiKey;
  var request = rest.get(this.baseUrl, { query: query });
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

MongoDBStrategy.prototype.get = function(id, done) {
  var request = rest.get(this.baseUrl + id, {
    query: {
      apiKey: this.apiKey
    }
  });
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

MongoDBStrategy.prototype.findByEmail = function(email, done) {
  this.query({ q: JSON.stringify({email: email}) }, done);
};

MongoDBStrategy.prototype.authenticate = function(email, password, done) {
  this.findByEmail(email, function(err, user) {
    if (!err) {
      if (user.password !== password) {
        user = null;
      }
    }
    done(err, user);
  });
};

module.exports = MongoDBStrategy;

// TODO: Store hashes rather than passwords...
/*var bcrypt = require('bcrypt');
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

function checkPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
*/