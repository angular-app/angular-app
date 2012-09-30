var express = require('express');
var passport = require('passport');
var MongoStrategy = require('./mongo-strategy');
var config = require('../config.js');
var app = express();

function sendCurrentUser(req, res) {
  console.log('sending user: ', req.user);
  res.send(req.user);
}

// Add a Mongo strategy for handling the authentication
var mongoAuthStrategy = new MongoStrategy(config.mongo.dbUrl, config.mongo.apiKey, config.mongo.dbName, config.mongo.usersCollection);
passport.use(mongoAuthStrategy);

// Login in to the app (using the mongo strategy)
app.post('/login', passport.authenticate(mongoAuthStrategy.name));

// Logout the current user
app.post('/logout', function(req, res){ console.log('Post logout'); req.logOut(); res.send(204); });
app.get('/logout', function(req, res){ console.log('Get logout'); req.logOut(); res.redirect('/'); });

// Retrieve the current user
app.get('/current-user', sendCurrentUser);

module.exports = {
  authRequired: function(req, res, next) {
    if ( req.isAuthenticated() ) {
      next();
    } else {
      res.send(401);
    }
  }
};