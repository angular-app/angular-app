var crypto = require('crypto');

function uid(len) {
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
    .toString('base64')
    .slice(0, len)
    .replace(/\//g, '-')
    .replace(/\+/g, '_');
}

// The xsrf middleware provide AngularJS style XSRF-TOKEN provision and validation
// Add it to your server configuration after the session middleware:
//   app.use(xsrf);
//  
module.exports = function(req, res, next) {
  // Generate XSRF token
  var token = req.session._csrf || (req.session._csrf = uid(24));
  // Add it to the cookie
  res.cookie('XSRF-TOKEN', token);

  // Ignore if it is just a read-only request
  if ('GET' === req.method || 'HEAD' === req.method || 'OPTIONS' === req.method) {
    return next();
  }

  // Check the token in the request against the one stored in the session
  var requestToken = req.headers['x-xsrf-token'];
  if ( requestToken !== token ) {
    return res.send(403);
  }
  // All is OK, continue as you were.
  return next();
};