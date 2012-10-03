angular.module('login', ['services.authentication']).directive('loginForm', ['AuthenticationService', function(AuthenticationService) {
  var directive = {
    templateUrl: 'login/form.tpl.html',
    restrict: 'E',
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.user = {};
      $scope.authError = false;
      $scope.authService = AuthenticationService;

      $scope.clearForm = function() {
        $scope.user = {};
      };
    }
  };
  return directive;
}]);