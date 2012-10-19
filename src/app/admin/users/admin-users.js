angular.module('admin-users', ['services.crud'], ['$routeProvider', function ($routeProvider) {

  $routeProvider.when('/admin/users', {
    templateUrl:'admin/users/users-list.tpl.html',
    controller:'UsersListCtrl',
    resolve:{
      users:['Users', function (Users) {
        return Users.all();
      }],
      currentUser: ['AuthenticationService', function(AuthenticationService) {
        return AuthenticationService.requireAuthenticatedUser();
      }]
    }
  });
  $routeProvider.when('/admin/users/new', {
    templateUrl:'admin/users/users-edit.tpl.html',
    controller:'UsersEditCtrl',
    resolve:{
      user:['Users', function (Users) {
        return new Users();
      }],
      currentUser: ['AuthenticationService', function(AuthenticationService) {
        return AuthenticationService.requireAdminUser();
      }]
    }
  });
  $routeProvider.when('/admin/users/:userId', {
    templateUrl:'admin/users/users-edit.tpl.html',
    controller:'UsersEditCtrl',
    resolve:{
      user:['$route', 'Users', function ($route, Users) {
        return Users.getById($route.current.params.userId);
      }],
      currentUser: ['AuthenticationService', function(AuthenticationService) {
        return AuthenticationService.requireAdminUser();
      }]
    }
  });
}]);

angular.module('admin-users').controller('UsersListCtrl', ['$scope', 'crudListMethods', 'users', function ($scope, crudListMethods, users) {
  $scope.users = users;

  angular.extend($scope, crudListMethods('/admin/users'));
}]);

angular.module('admin-users').controller('UsersEditCtrl', ['$scope', '$location', 'crudEditMethods', 'user', function ($scope, $location, crudEditMethods, user) {

  $scope.password = user.password;
  angular.extend($scope, crudEditMethods('item', user, 'form', function () {
    $location.path('/admin/users');
  }, function() {
    $scope.updateError = true;
  }));
}]);

angular.module('admin-users').directive('uniqueEmail', ["Users", function (Users) {
  return {
    require:'ngModel',
    restrict:'A',
    link:function (scope, el, attrs, ctrl) {

      //using push() here to run it as the last parser, after we are sure that other validators were run
      ctrl.$parsers.push(function (viewValue) {

        ctrl.$setValidity('uniqueEmail', false);
        if (viewValue) {
          Users.query({email:viewValue}, function (users) {
            if (users.length === 0) {
              ctrl.$setValidity('uniqueEmail', true);
            }
          });
          return viewValue;
        } else {
          return undefined;
        }
      });
    }
  };
}]);

angular.module('admin-users').directive('validateEquals', function() {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      function validateEqual(myValue, otherValue) {
        if (myValue === otherValue) {
          ctrl.$setValidity('equal', true);
          return myValue;
        } else {
          ctrl.$setValidity('equal', false);
          return undefined;
        }
      }

      scope.$watch(attrs.validateEquals, function(otherModelValue) {
        ctrl.$setValidity('equal', ctrl.$viewValue === otherModelValue);
      });

      ctrl.$parsers.push(function(viewValue) {
        return validateEqual(viewValue, scope.$eval(attrs.validateEquals));
      });

      ctrl.$formatters.push(function(modelValue) {
        return validateEqual(modelValue, scope.$eval(attrs.validateEquals));
      });
    }
  };
});