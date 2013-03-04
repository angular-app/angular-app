angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('loginToolbar', ['currentUser', 'security', function(currentUser, security) {
  var directive = {
    templateUrl: 'security/login/toolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.userInfo = currentUser.info;
      $scope.isAuthenticated = currentUser.isAuthenticated;
      $scope.logout = function() { security.logout(); };
      $scope.login = function() { security.showLogin(); };
    }
  };
  return directive;
}]);