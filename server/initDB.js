var config = require('./config.js');
var rest = require('restler');
var apiKey = config.mongo.apiKey;
var baseUrl = config.mongo.dbUrl + '/databases/' + config.security.dbName + '/collections/';

console.log('Configuration: \n', config);

var checkDocument = function(collection, query, done) {
  var url = baseUrl + collection + '/';
  console.log(url);
  var params = { apiKey:apiKey, q: JSON.stringify(query) };
  var request = rest.get(url, { query: params });
  request.on('error', function(err, response) { console.log('error', err, response); done(err, null); });
  request.on('fail', function(err, response) {  console.log('fail', err, response); done(err, null); });
  request.on('success', function(data) {  console.log('success', data); done(null, data); });
};

var createDocument = function(collection, document, done) {
  var url = baseUrl + collection + '/?apiKey=' + apiKey;
  console.log(url);
  var request = rest.postJson(url, document);
  request.on('error', function(err, response) { console.log('error', err, response); done(err, null); });
  request.on('fail', function(err, response) {  console.log('fail', err, response); done(err, null); });
  request.on('success', function(data) {  console.log('success', data); done(null, data); });
};

var adminUser = { email: 'admin@abc.com', password: 'changeme', admin: true};
console.log('Generating admin user...', adminUser);

console.log('Checking it is not already created...');
checkDocument(config.security.usersCollection, adminUser, function(err, data) {
  if ( !err && data.length === 0 ) {
    console.log('Creating new admin user...', err, data);
    createDocument(config.security.usersCollection, adminUser, function(err, data) {
      console.log('Created new admin user...');
      console.log(err);
      console.log(data);
    });
  } else {
    console.log('User already created.');
  }
});

