'use strict';

module.exports = function(app){
  app.directive('aboutDirective', function(){
    return {
      restrict: 'AC',
      templateUrl: '/js/directives/aboutDirective.html'
    };
  });
};
