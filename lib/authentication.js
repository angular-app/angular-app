module.exports = {
  required: function(req, res, next) {
    if ( req.isAuthenticated() ) {
      next();
    } else {
      res.send(401);
    }
  }
};