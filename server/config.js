module.exports = {
  mongo: {
    dbUrl: 'https://api.mongolab.com/api/1/databases',  // The base url of the MongoLab DB server
    apiKey: '4fb51e55e4b02e56a67b0b66',                 // Our MongoLab API key
    dbName: 'ascrum',                                   // The name of database to which this server connect
    usersCollection: 'users'                            // The name of the collection that will contain our user information
  },
  server: {
    listenPort: 3000,                                   // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    distFolder: '../angular-app/dist',                  // The folder that contains the application files (note that the files are in a different repository)
    staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
    cookieSecret: 'angular-app'                         // The secret for encrypting the cookie
  }
};