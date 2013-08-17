exports.addRoutes = function(app, security) {

app.post('/login', security.login);
app.post('/logout', security.logout);

// Retrieve the current user
app.get('/current-user', security.sendCurrentUser);

// Retrieve the current user only if they are authenticated
app.get('/authenticated-user', function(req, res) {
  security.authenticationRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

// Retrieve the current user only if they are admin
app.get('/admin-user', function(req, res) {
  security.adminRequired(req, res, function() { security.sendCurrentUser(req, res); });
});

};