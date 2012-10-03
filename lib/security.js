var express = require('express');
var passport = require('passport');
var MongoStrategy = require('./mongo-strategy');
var app = express();

var getUserInfo = function(req) {
  var user = {};
  if ( req.user ) {
    user.id = req.user._id.$oid;
    user.email = req.user.email;
    user.firstName = req.user.firstName;
    user.lastName = req.user.lastName;
  }
  return user;
};

var security = {
  initialize: function(url, apiKey, dbName, authCollection) {
    passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  },
  authenticationRequired: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send(401, getUserInfo(req));
    }
  },
  adminRequired: function(req, res, next) {
    if (req.user && req.user.admin ) {
      next();
    } else {
      res.send(401, getUserInfo(req));
    }
  },
  sendCurrentUser: function(req, res, next) {
    res.json(200, getUserInfo(req));
  },
  login: function(req, res, next) {
    function authenticationFailed(err, user, info){
      if (err) { return next(err); }
      if (!user) { return res.json({user: null}); }
      req.logIn(user, function(err) {
        if ( err ) {
          return next(err);
        }
        return res.json({user: user});
      });
    }
    return passport.authenticate(MongoStrategy.name, authenticationFailed)(req, res, next);
  },
  logout: function(req, res, next) {
    req.logout();
    res.send(204);
  }
};

module.exports = security;