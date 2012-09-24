var LocalStrategy = require('passport-local').Strategy;

var users = [
  { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
  { id: 2, username: 'joe', password: 'birthday', email: 'joe@example.com' }
];

function findById(id, done) {
  var idx = id - 1;
  if (users[idx]) {
    done(null, users[idx]);
  } else {
    done(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, done) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return done(null, user);
    }
  }
  return done(null, null);
}

function getStrategy() {
  return new LocalStrategy(function(username, password, done) {
    findByUsername(username, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
      if (user.password !== password) { return done(null, false, { message: 'Invalid password' }); }
      return done(null, user);
    });
  });
}

module.exports = {
  findByUsername: findByUsername,
  findById: findById,
  Strategy: getStrategy()
};
