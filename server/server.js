var express = require('express');
var path = require('path');
var https = require('https');
var mongoProxy = require('./lib/mongo-proxy');

var passport = require('passport');
var userAuth = require('./lib/user-auth');

var LISTEN_PORT = 3000;
var publicFolder = path.resolve(__dirname, '../dist');

var app = express();

////////////////////////////////////////////////////////
// This route deals with static files, index.html, css, images, etc.
app.use(express['static'](publicFolder));

app.use(express.logger());                      // Log requests to the console
app.use(express.bodyParser());                  // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.cookieParser('angular-app'));   // Hash cookies with this secret
app.use(express.cookieSession());               // Store the session in the (secret) cookie
app.use(passport.initialize());                 // Initialize PassportJS
app.use(passport.session());                    // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request

// The Passport Session strategy needs to serialize the currently logged in user into the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  userAuth.findById(id, function (err, user) {
    done(err, user);
  });
});

////////////////////////////////////////////////////////
// This route deals with connections to the database
app.use('/databases', mongoProxy('https://api.mongolab.com/api/1/databases', '4fb51e55e4b02e56a67b0b66', https));

////////////////////////////////////////////////////////
// This route deals with logging in to the app - it uses the local authentication method to login the user
passport.use(userAuth.Strategy);                  // Set up our local authentication strategy
app.post('/login', passport.authenticate('local'), function(req, res){
  console.log('Logging in');
  res.end();
});

////////////////////////////////////////////////////////
// This route deals with logging out of the app
app.get('/logout', function(req, res){ req.logOut(); });

////////////////////////////////////////////////////////
// This route deals enables HTML5Mode by forwarding missing files to the index.html
// TODO: We should consider putting static files (images, etc) in a sub folder so that we get proper 404 errors for missing static files, rather than returning index.html!
app.all('/*', function(req, res) {
  console.log("User", req.user);
  console.log("Session", req.session);
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: publicFolder });
});

////////////////////////////////////////////////////////
// Simple error handler route
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

////////////////////////////////////////////////////////
// Kick off the web server
app.listen(LISTEN_PORT);
console.log('Angular App Server - listening on port: ' + LISTEN_PORT);

