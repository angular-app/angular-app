var url = require('url');
var https = require('https');

module.exports = function (dbUrl, dbName, basePath, apiKey) {

  var mapUrl = function(reqUrl) {
    var urlObj = url.parse(reqUrl, true);
    return url.format(urlObj);
  };

  var proxy = function(req, res, next) {

  };
  
  proxy.mapUrl = mapUrl;
  return proxy;
};