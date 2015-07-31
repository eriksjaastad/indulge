'use strict';

module.exports = function(app) {
  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/about', {
      controller: 'aboutController',
      templateUrl: 'js/views/about.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  }]);
}
