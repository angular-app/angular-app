var express = require('express');
var mongoProxy = require('./lib/mongo-proxy');
var config = require('./config.js');
var passport = require('passport');
var security = require('./lib/security');

var app = express();

// Serve up the favicon
app.use(express.favicon(config.server.distFolder + '/favicon.ico'));

// First looks for a static file: index.html, css, images, etc.
app.use(config.server.staticUrl, express['static'](config.server.distFolder));
app.use(config.server.staticUrl, function(req, res, next) {
  res.send(404); // If we get here then the request for a static file is invalid
});

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.cookieParser(config.server.cookieSecret));  // Hash cookies with this secret
app.use(express.cookieSession());                           // Store the session in the (secret) cookie
app.use(passport.initialize());                             // Initialize PassportJS
app.use(passport.session());                                // Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request

app.use(function(req, res, next) { console.log('Current User:', req.user.firstName, req.user.lastName); next(); });

// Proxy database calls to the MongoDB
app.use('/databases', security.authRequired);
app.use('/databases', mongoProxy(config.mongo.dbUrl, config.mongo.apiKey));

// This route deals enables HTML5Mode by forwarding missing files to the index.html
app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: config.server.distFolder });
});

// A standard error handler - it picks up any left over errors and returns a nicely formatted http 500 error
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
app.listen(config.server.listenPort);
console.log('Angular App Server - listening on port: ' + config.server.listenPort);