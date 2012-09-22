var express = require('express');
var path = require('path');
var https = require('https');
var querystring = require('querystring');

var LISTEN_PORT = 3000;
var publicFolder = path.resolve(__dirname, '../dist');
var app = express();

////////////////////////////////////////////////////////
// This route deals with static files, index.html, css, images, etc.
app.use(express['static'](publicFolder));

////////////////////////////////////////////////////////
// This route deals with connections to the database
// The urls should be of the form:  http://localhost:3000/db/myCollection?q=myQuery
app.use('/db/:collection', function(req, res) {
  var query = {
    apiKey: '4fb51e55e4b02e56a67b0b66',
    q: req.query.q
  };
  var options = {
    host: 'api.mongolab.com',
    port: 443,
    path: '/api/1/databases/ascrum/collections/' + req.params.collection + '?' + querystring.stringify(query),
    headers: {
        'Content-Type': 'application/json'
    }
  };
  console.log('DB request: ', options);
  https.get(options, function(dbRes) {
    var json = '';
    dbRes.setEncoding('utf8'); // We need to tell express that the chunks will be strings
    dbRes.on('data', function(chunk) { console.log(chunk); json += chunk; });
    dbRes.on('end', function(){
      res.charset = this.charset || 'utf-8';
      res.set('Content-Type', 'application/json');
      res.send(json);
    });
  });
});

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

