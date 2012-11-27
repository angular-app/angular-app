angular.module('directives.button', []).directive('button', function() {
  return {
    restrict: 'E',
    link: function(scope, element) {
      element.addClass('btn');
    }
  };
});