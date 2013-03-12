// JSON vulnerability protection
// we prepend the data with ")]},\n", which will be stripped by $http in AngularJS
module.exports = function(req, res, next) {
  var _send = res.send;
  res.send = function(body) {
    var contentType = res.getHeader('Content-Type');
    if ( contentType && contentType.indexOf('application/json') !== -1 ) {
      if (2 == arguments.length) {
        // res.send(body, status) backwards compat
        if ('number' != typeof body && 'number' == typeof arguments[1]) {
          this.statusCode = arguments[1];
        } else {
          this.statusCode = body;
          body = arguments[1];
        }
      }
      body = ")]}',\n" + body;
      return _send.call(res, body);
    }
    _send.apply(res, arguments);
  };
  next();
};