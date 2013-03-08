angular.module('authentication.login.toolbar', [])

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