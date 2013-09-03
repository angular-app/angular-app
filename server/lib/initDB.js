// code for initializing the DB w/ an admin user
var rest = require('request');

var initDB = {
  adminUser: { email: 'admin@abc.com', password: 'changeme', admin: true, firstName: 'Admin', lastName: 'User' },

  initialize: function(cfg) {
    initDB.apiKey = cfg.mongo.apiKey;
    initDB.baseUrl = cfg.mongo.dbUrl + '/databases/' + cfg.security.dbName + '/collections/';
    initDB.usersCollection = cfg.security.usersCollection;
  },
  
  checkDocument: function(collection, query, done) {
    var url = initDB.baseUrl + collection + '/';
    console.log("rest.get - " + url);
    var params = { apiKey:initDB.apiKey, q: JSON.stringify(query) };
    var request = rest.get(url, { qs: params, json: {} }, function(err, response, data) {
      if ( err ) {
        console.log('There was an error checking the documents', err);
      }
      done(err, data);
    });
  },
  
  createDocument: function(collection, doc, done) {
    var url = initDB.baseUrl + collection + '/';
    console.log("rest.post - " + url);
    var request = rest.post(url, { qs: { apiKey:initDB.apiKey }, json: doc }, function(err, response, data) {
      if ( !err ) {
        console.log('Document created', data);
      }
      done(err, data);
    });
  },
  
  deleteDocument: function(collection, docId, done) {
    var url = initDB.baseUrl + collection + '/' + docId;
    console.log("rest.del - " + url);
    var request = rest.del(url, { qs: { apiKey:initDB.apiKey }, json: {} }, function(err, response, data) {
      if ( !err ) {
        console.log('Document deleted', data);
      }
      done(err, data);
    });
  },
  
  addAdminUser: function(done) {
    console.log('*** Admin user properties:', initDB.adminUser);
    console.log('Checking that admin user does not exist...');
    initDB.checkDocument(initDB.usersCollection, initDB.adminUser, function(err, data) {
      if ( !err && data.length === 0 ) {
        console.log('Creating new admin user...', err, data);
        initDB.createDocument(initDB.usersCollection, initDB.adminUser, function(err, data) {
          console.log('Created new admin user...');
          console.log(err);
          console.log(data);
          done(err, data);
        });
      } else {
        if (data.message) {
          console.log('Error: ' + data.message);
        } else {
          console.log('User already created.');
        }
        done(err, data);
      }
    });
  }
};

module.exports = initDB;

