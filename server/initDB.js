var config = require('./config.js').mongo;
var rest = require('restler');
var baseUrl = config.dbUrl + '/' + config.dbName + '/collections/';
var queryOptions = { apiKey: config.apiKey };

console.log('Configuration: \n', config);

var createDocument = function(collection, document, done) {
  var url = baseUrl + collection + '/?apiKey=' + config.apiKey;
  console.log(url);
  console.log(queryOptions);
  var request = rest.postJson(url, { data: document });
  request.on('error', function(err, response) { done(err, null); });
  request.on('fail', function(err, response) { done(err, null); });
  request.on('success', function(data) { done(null, data); });
};

console.log('Generating admin user...');
var adminUser = { email: 'admin@abc.com', password: 'changeme', admin: true};
createDocument(config.usersCollection, adminUser, function(err, data) {
  console.log(err);
  console.log(data);
});
