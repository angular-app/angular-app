angular.module('authentication.login.form', ['services.localizedMessages'])

// The LoginFormController provides the behaviour behind a reusable form to allow users to authenticate.
// This controller and its template (login/form.tpl.html) are used in a modal dialog box by the authentication service.
.controller('LoginFormController', ['$scope', 'authentication', 'localizedMessages', 'currentUser', function($scope, authentication, localizedMessages, currentUser) {
  // The model for this form 
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something diffent for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( authentication.getLoginReason() ) {
    $scope.authReason = ( currentUser.isAuthenticated() ) ?
      localizedMessages.get('login.reason.notAuthorized') :
      localizedMessages.get('login.reason.notAuthenticated');
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous authentication errors
    $scope.authError = null;

    // Try to login
    authentication.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
      if ( !loggedIn ) {
        // If we get here then the login failed due to bad credentials
        $scope.authError = localizedMessages.get('login.error.invalidCredentials');
      }
    }, function(x) {
      console.log(x);
      // If we get here then there was a problem with the login request to the server
      $scope.authError = localizedMessages.get('login.error.serverError');
    });
  };

  $scope.clearForm = function() {
    user = {};
  };

  $scope.cancelLogin = function() {
    authentication.cancelLogin();
  };
}]);