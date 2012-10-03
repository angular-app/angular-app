angular.module('login', ['services.authentication', 'directives.modal']).directive('loginForm', ['AuthenticationService', function(AuthenticationService) {
  var directive = {
    templateUrl: 'login/form.tpl.html',
    restrict: 'E',
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.user = {};
      $scope.authError = null;
      $scope.authService = AuthenticationService;

      $scope.clearForm = function() {
        $scope.user = {};
      };

      $scope.$on('AuthenticationService.unauthorized', function(event, request) {
        $scope.showLoginForm = true;
        if ( request.data.user ) {
          $scope.authError = "You do not have the necessary access permissions.  Do you want to login as someone else?";
        }
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
    }
  };
  return directive;
}]);