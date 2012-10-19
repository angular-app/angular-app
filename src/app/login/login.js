angular.module('login', ['services.authentication', 'directives.modal']).directive('loginForm', ['AuthenticationService', 'currentUser', function(AuthenticationService, currentUser) {
  var directive = {
    templateUrl: 'login/form.tpl.html',
    restrict: 'E',
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.user = {};
      $scope.authError = null;
      $scope.authService = AuthenticationService;
      $scope.showLoginForm = false;

      $scope.clearForm = function() {
        $scope.user = {};
      };

      $scope.showLogin = function(msg) {
        $scope.authError = msg;
        $scope.showLoginForm = true;
      };

      $scope.cancelLogin = function() {
        AuthenticationService.cancelLogin();
      };

      $scope.hideLogin = function() {
        $scope.showLoginForm = false;
      };

      $scope.getLoginReason = function() {
        var reason = AuthenticationService.getLoginReason();
        var isAuthenticated = currentUser.isAuthenticated();

        var message = "";
        switch(reason) {
          case 'user-request':
            message = "Please enter you login details below";
            break;
          case 'unauthenticated-client':
          case 'unauthorized-client':
          case 'unauthorized-server':
            if ( isAuthenticated ) {
                message = "You do not have the necessary access permissions.  Do you want to login as someone else?";
            } else {
                message = "You must be logged in to access this part of the application.";
            }
            break;
          default:
            message = "";
            break;
          }
        return message;
      };

      // A login is required.  If the user decides not to login then we can call cancel
      $scope.$watch(AuthenticationService.isLoginRequired, function(value) {
        if ( value ) {
          $scope.showLogin($scope.getLoginReason());
        } else {
          $scope.hideLogin();
        }
      });

      $scope.login = function() {
        $scope.authError = null;
        AuthenticationService.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( !loggedIn ) {
            $scope.authError = "Login failed.  Please check your credentials and try again.";
          }
        });
      };

    }
  };
  return directive;
}]);

angular.module('login').directive('loginToolbar', ['currentUser', 'AuthenticationService', function(currentUser, AuthenticationService) {
  var directive = {
    templateUrl: 'login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.userInfo = currentUser.info;
      $scope.isAuthenticated = currentUser.isAuthenticated;
      $scope.logout = function() { AuthenticationService.logout(); };
      $scope.login = function() { AuthenticationService.showLogin(); };
    }
  };
  return directive;
}]);
