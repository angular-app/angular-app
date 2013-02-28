angular.module('authentication.login', ['services.localizedMessages'])

// The loginForm directive provides a reusable modal form to allow users to authenticate.
// Normally this directive will be added to the main HTML document and then shown whenever a log in is required.
// The form watches authentication.isLoginRequired to decide whether it should be shown or hidden.
.directive('loginForm', ['authentication', 'localizedMessages', 'currentUser', function(authentication, localizedMessages, currentUser) {
  var directive = {
    templateUrl: 'authentication/login/form.tpl.html',
    restrict: 'E',
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.user = {};
      $scope.authError = null;
      $scope.authService = authentication;

      // Compute a localised message string to explain why a login is required
      $scope.$watch(function() { return authentication.getLoginReason(); }, function(reason) {
        var isAuthenticated = currentUser.isAuthenticated();
        var message = "";
        switch(reason) {
          case 'user-request':
            message = "Please enter you login details below";
            break;
          case 'unauthenticated-client':
          case 'unauthorized-client':
          case 'unauthorized-server':
            message = ( isAuthenticated ) ?
              localizedMessages.get('login.error.notAuthorized') :
              localizedMessages.get('login.error.notAuthenticated');
            break;
        }
        $scope.authError = message;
      });

      // Attempt to authenticate (i.e. login) the user specified in the form input fields.
      $scope.login = function() {
        // Clear any previous authentication errors
        $scope.authError = null;
        authentication.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( !loggedIn ) {
            $scope.authError = "Login failed.  Please check your credentials and try again.";
          }
        });
      };

    }
  };
  return directive;
}])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['currentUser', 'authentication', function(currentUser, authentication) {
  var directive = {
    templateUrl: 'authentication/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.userInfo = currentUser.info;
      $scope.isAuthenticated = currentUser.isAuthenticated;
      $scope.logout = function() { authentication.logout(); };
      $scope.login = function() { authentication.showLogin(); };
    }
  };
  return directive;
}]);
