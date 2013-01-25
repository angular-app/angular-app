var util = require('util');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var rest = require('restler');

function MongoDBStrategy(dbUrl, apiKey, dbName, collection) {
  this.dbUrl = dbUrl;
  this.apiKey = apiKey;
  this.dbName = dbName;
  this.collection = collection;
  this.baseUrl = this.dbUrl + '/databases/' + this.dbName + '/collections/' + collection + '/';

  // Call the super constructor - passing in our user verification function
  // We use the email field for the username
  LocalStrategy.call(this, { usernameField: 'email' }, this.verifyUser.bind(this));

  // Serialize the user into a string (id) for storing in the session
  passport.serializeUser(function(user, done) {
    done(null, user._id.$oid); // Remember that MongoDB has this weird { _id: { $oid: 1234567 } } structure
  });

  // Deserialize the user from a string (id) into a user (via a cll to the DB)
  passport.deserializeUser(this.get.bind(this));

  // We want this strategy to have a nice name for use by passport, e.g. app.post('/login', passport.authenticate('mongo'));
  this.name = MongoDBStrategy.name;
}

// MongoDBStrategy inherits from LocalStrategy
util.inherits(MongoDBStrategy, LocalStrategy);

MongoDBStrategy.name = "mongo";

// Query the users collection
MongoDBStrategy.prototype.query = function(query, done) {
  query.apiKey = this.apiKey;     // Add the apiKey to the passed in query
  var request = rest.get(this.baseUrl, { query: query });
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

// Get a user by id
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

// Find a user by their email
MongoDBStrategy.prototype.findByEmail = function(email, done) {
  this.query({ q: JSON.stringify({email: email}) }, function(err, result) {
    if ( result && result.length === 1 ) {
      return done(err, result[0]);
    }
    done(err, null);
  });
};

// Check whether the user passed in is a valid one
MongoDBStrategy.prototype.verifyUser = function(email, password, done) {
  this.findByEmail(email, function(err, user) {
    if (!err && user) {
      if (user.password !== password) {
        user = null;
      }
    }
    done(err, user);
  });
};

module.exports = MongoDBStrategy;

// TODO: Store hashes rather than passwords... node-bcrypt requires python to be installed :-(
/*var bcrypt = require('bcrypt');
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

function checkPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}
*/