angular.module('signin', ['services.authentication', 'services.users']).controller('SignInCtrl', ['$scope', function($scope) {

  $scope.user = {};
  $scope.authError = false;

  $scope.clearForm = function() {
    $scope.user = {};
  };
}]);