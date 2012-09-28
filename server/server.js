var express = require('express');
var mongoProxy = require('./lib/mongo-proxy');
var config = require('./config.js');

var passport = require('passport');
var MongoStrategy = require('./lib/mongo-strategy');

var LISTEN_PORT = 3000;
var distFolder = '../dist';
var staticUrl = '/static';

var app = express();

// Serve up the favicon
app.use(express.favicon(distFolder + '/favicon.ico'));

// First looks for a static file: index.html, css, images, etc.
app.use(staticUrl, express['static'](distFolder));
app.use(staticUrl, function(req, res, next) {
  res.send(404); // If we get here then the request for a static file is invalid
});

app.use(express.logger());                      // Log requests to the console
app.use(express.bodyParser());                  // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.cookieParser('angular-app'));   // Hash cookies with this secret
app.use(express.cookieSession());               // Store the session in the (secret) cookie
app.use(passport.initialize());                 // Initialize PassportJS
app.use(passport.session());                    // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
passport.use(new MongoStrategy(config.dbUrl, config.apiKey, 'ascrum', 'users'));              // Add a Mongo strategy for handling the authentication

// Proxy database calls to the MongoDB
app.use('/databases', mongoProxy(config.dbUrl, config.apiKey));

// Login in to the app (using the mongo strategy)
app.post('/login', passport.authenticate('mongo'));

// Logout the current user
app.post('/logout', function(req, res){ req.logOut(); });

// This route deals enables HTML5Mode by forwarding missing files to the index.html
// TODO: We should consider putting static files (images, etc) in a sub folder so that we get proper 404 errors for missing static files, rather than returning index.html!
app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: distFolder });
});

app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.listen(LISTEN_PORT);
console.log('Angular App Server - listening on port: ' + LISTEN_PORT);