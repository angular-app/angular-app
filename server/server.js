var express = require('express');
var path = require('path');
var https = require('https');
var mongoProxy = require('./lib/mongo-proxy');

var LISTEN_PORT = 3000;
var publicFolder = path.resolve(__dirname, '../dist');
var app = express();

////////////////////////////////////////////////////////
// This route deals with static files, index.html, css, images, etc.
app.use(express['static'](publicFolder));

////////////////////////////////////////////////////////
// This route deals with connections to the database
app.use('/databases', mongoProxy('https://api.mongolab.com/api/1', '4fb51e55e4b02e56a67b0b66', https));

////////////////////////////////////////////////////////
// This route deals enables HTML5Mode by forwarding missing files to the index.html
// TODO: We should consider putting static files (images, etc) in a sub folder so that we get proper 404 errors for missing static files, rather than returning index.html!
app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: publicFolder });
});

////////////////////////////////////////////////////////
// Simple error handler route
app.use(function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
});

////////////////////////////////////////////////////////
// Kick off the web server
app.listen(LISTEN_PORT);
console.log('Angular App Server - listening on port: ' + LISTEN_PORT);

