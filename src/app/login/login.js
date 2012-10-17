angular.module('login', ['services.authentication', 'directives.modal']).directive('loginForm', ['AuthenticationService', function(AuthenticationService) {
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

      $scope.showLogin = function(cancel, msg) {
        $scope.authError = msg;
        $scope.showLoginForm = true;
        // Set up the cancel method
        $scope.cancelLogin = function() {
          cancel();
          $scope.showLoginForm = false;
        };
      };

      // TODO: Move this into a i8n service
      function getMessage(reason) {
        switch(reason) {
          case 'unauthenticated':
            return "You must be logged in to access this part of the application.";
          case 'unauthorized':
            return "You do not have the necessary access permissions.  Do you want to login as someone else?";
          default:
            return null;
        }
      }

      // A login is required.  If the user decides not to login then we can call cancel
      $scope.$on('AuthenticationService.loginRequired', function(evt, reason, cancel) {
        console.log('loginRequired');
        $scope.showLogin(cancel, getMessage(reason));
      });

      $scope.login = function() {
        $scope.authError = null;
        AuthenticationService.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( loggedIn ) {
            $scope.showLoginForm = false;
          } else {
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
      $scope.login = function() { AuthenticationService.loginRequired(); };
    }
  };
  return directive;
}]);
