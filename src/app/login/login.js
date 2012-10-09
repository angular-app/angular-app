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

      $scope.showLogin = function() {
        $scope.showLoginForm = true;
      };

      $scope.$on('AuthenticationService.login', function() {
        $scope.authError = null;
        $scope.showLogin();
      });
      $scope.$on('AuthenticationService.unauthenticated', function() {
        $scope.authError = "You must be logged in to access this part of the application.";
        $scope.showLogin();
      });
      $scope.$on('AuthenticationService.unauthorized', function() {
        $scope.authError = "You do not have the necessary access permissions.  Do you want to login as someone else?";
        $scope.showLogin();
      });

      $scope.login = function() {
        $scope.authError = null;
        AuthenticationService.login($scope.user.email, $scope.user.password).then(function(user) {
          if ( user ) {
            $scope.showLoginForm = false;
          } else {
            $scope.authError = "Login failed.  Please check your credentials and try again.";
          }
        });
      };

      $scope.cancel = function() {
        AuthenticationService.cancelLogin();
        $scope.showLoginForm = false;
      };
    }
  };
  return directive;
}]);

angular.module('login').directive('loginToolbar', ['AuthenticationService', function(AuthenticationService) {
  var directive = {
    templateUrl: 'login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.$watch(function() { return AuthenticationService.currentUser; }, function(value) { $scope.currentUser = value; });
      $scope.logout = function() { AuthenticationService.logout(); };
      $scope.login = function() { AuthenticationService.showLogin(); };
    }
  };
  return directive;
}]);
