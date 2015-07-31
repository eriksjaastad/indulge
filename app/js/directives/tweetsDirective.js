'use strict';

module.exports = function(app){
  app.directive('tweetsDirective', function(){
    return {
      restrict: 'AC',
      templateUrl: '/js/directives/tweetsDirective.html'
    };
  });
};
