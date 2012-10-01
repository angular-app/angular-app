var express = require('express');
var passport = require('passport');
var MongoStrategy = require('./mongo-strategy');
var app = express();

module.exports = {
  initialize: function(url, apiKey, dbName, authCollection) {
    passport.use(new MongoStrategy(url, apiKey, dbName, authCollection));
  },
  authRequired: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send(401);
    }
  },
  sendCurrentUser: function(req, res, next) {
    res.send(req.user);
  },
  login: function(req, res, next) {
    return passport.authenticate(MongoStrategy.name)(req, res, next);
  },
  logout: function(req, res, next) {
    req.logout();
    res.send(204);
  }
};