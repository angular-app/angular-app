var format, https, qs, request, url;

url = require("url");

request = require("request");

format = require("util").format;

qs = require("querystring");

https = require("https");

module.exports = function(basePath, apiKey) {
  var mapRequest, mapUrl, proxy;
  console.log("Proxying MongoLab at " + basePath + " with " + apiKey);
  basePath = url.parse(basePath);
  mapUrl = module.exports.mapUrl = function(reqUrlString) {
    var key, newUrl, path, query, reqUrl;
    reqUrl = url.parse(reqUrlString, true);
    newUrl = {};
    query = {
      apiKey: apiKey
    };
    for (key in reqUrl.query) {
      query[key] = reqUrl.query[key];
    }
    path = "" + basePath.pathname + reqUrl.pathname + "?" + (qs.stringify(query));
    newUrl.uri = format("%s//%s%s", basePath.protocol, basePath.hostname, path);
    return newUrl;
  };
  mapRequest = module.exports.mapRequest = function(req) {
    var newReq;
    newReq = mapUrl(req.url);
    if (req.method !== "GET" && req.body) {
      if (req.body instanceof Object) {
        newReq.body = JSON.stringify(req.body);
      }
    }
    newReq.method = req.method;
    newReq.headers = req.headers || {};
    newReq.headers.host = newReq.hostname;
    return newReq;
  };
  proxy = function(req, res, next) {
    var dbReq, options;
    try {
      options = mapRequest(req);
      dbReq = request(options).pipe(res);
      return dbReq.on("response", function(r) {
        return r.pipe(res);
      });
    } catch (error) {
      console.log("ERROR: ", error.stack);
      res.json(error);
      return res.end();
    }
  };
  proxy.mapUrl = mapUrl;
  proxy.mapRequest = mapRequest;
  return proxy;
};
