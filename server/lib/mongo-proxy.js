var url = require('url');
var qs = require('querystring');

module.exports = function(basePath, apiKey, https) {
  console.log('Proxy creating', basePath, apiKey);

  basePath = url.parse(basePath);

  // Map the request url to the mongolab url
  // @Returns a parsed Url object
  var mapUrl = module.exports.mapUrl = function(reqUrlString) {
    var reqUrl = url.parse(reqUrlString, true);
    var newUrl = {
      hostname: basePath.hostname,
      protocol: basePath.protocol,
      pathname: basePath.pathname + reqUrl.pathname,
      query: { apiKey: apiKey}
    };
    for(var key in reqUrl.query) {
      newUrl.query[key] = reqUrl.query[key];
    }
    // https request expects this field !
    newUrl.path = newUrl.pathname + '?' + qs.stringify(newUrl.query);
    return newUrl;
  };

  var proxy = function(req, res, next) {
    try {
      console.log('Request', req.originalUrl);
      var options = mapUrl(req.originalUrl);
      options.headers = req.headers;
      options.headers.host = options.hostname;
      options.method = req.method;
      console.log('Mapped Request', options);
      
      // Create the request to the db
      var dbReq = https.request(options, function(dbRes) {
        var data = "";
        res.headers = dbRes.headers;
        dbRes.setEncoding('utf8');
        dbRes.on('data', function(chunk) {
          // Pass back any data from the response.
          console.log(chunk);
          data = data + chunk;
        });
        dbRes.on('end', function() {
          res.statusCode = dbRes.statusCode;
          res.httpVersion = dbRes.httpVersion;
          res.trailers = dbRes.trailers;
          res.send(data);
          res.end();
          console.log('End');
        });
      });
      console.log('HREF: ', dbReq);
      // Send any data the is passed from the original request
      dbReq.end(req.data);
    } catch (error) {
      console.log(error);
      res.send(error);
      res.end();
    }
  };

  // Attach the mapurl fn (mostly for testing)
  proxy.mapUrl = mapUrl;
  return proxy;
};