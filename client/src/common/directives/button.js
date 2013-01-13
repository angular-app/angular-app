angular.module('directives.button', [])

.directive('button', function() {
  return {
    restrict: 'E',
    compile: function(element) {
      element.addClass('btn');
    }
  };
})

.directive('primaryButton', function() {
  return {
    restrict: 'E',
    template: '<button ng-transclude></button>',
    transclude: true,
    replace: true,
    compile: function(element) {
      element.addClass('btn-primary');
    }
  };
});