var config = require('./config.js');
var rest = require('request');
var apiKey = config.mongo.apiKey;
var baseUrl = config.mongo.dbUrl + '/databases/' + config.security.dbName + '/collections/';

console.log('Configuration: \n', config);

var checkDocument = function(collection, query, done) {
  var url = baseUrl + collection + '/';
  console.log(url);
  var params = { apiKey:apiKey, q: JSON.stringify(query) };
  var request = rest.get(url, { qs: params, json: {} }, function(err, response, data) {
    done(null, data);
  });
};

var createDocument = function(collection, doc, done) {
  var url = baseUrl + collection + '/';
  console.log(url);
  var request = rest.post(url, { qs: { apiKey:apiKey }, json: doc }, function(err, response, data) {
    if ( !err ) {
      console.log('Document created', data);
    }
    done(err, data);
  });
};

var adminUser = { email: 'admin@abc.com', password: 'changeme', admin: true, firstName: 'Admin', lastName: 'User' };
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

