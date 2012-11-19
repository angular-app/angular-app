var config = require('./config.js').mongo;
var rest = require('restler');
var baseUrl = config.dbUrl + '/' + config.dbName + '/collections/';
var queryOptions = { apiKey: config.apiKey };

console.log('Configuration: \n', config);

var checkDocument = function(collection, query, done) {
  var url = baseUrl + collection + '/';
  var params = { apiKey:config.apiKey, q: JSON.stringify(query) };
  var request = rest.get(url, { query: params });
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

var createDocument = function(collection, document, done) {
  var url = baseUrl + collection + '/?apiKey=' + config.apiKey;
  var request = rest.postJson(url, document);
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

console.log('Generating admin user...');
var adminUser = { email: 'admin@abc.com', password: 'changeme', admin: true};

checkDocument(config.usersCollection, adminUser, function(err, data) {
  if ( !err && data.length === 0 ) {
    createDocument(config.usersCollection, adminUser, function(err, data) {
      console.log(err);
      console.log(data);
    });
  } else {
    console.log('User already created.');
  }
});

