'use strict';

module.exports = function (app) {

  var handleError = function(err) {
    console.log(err);
  }

  app.factory('twitter', ['$http', function($http) {
    return function() {
      return {
        getter: function(callback) {
          $http({
            method: 'GET',
            url: 'https://data.seattle.gov/resource/7stk-8j8w.json'
          })
          .success(callback)
          .error(handleError);
        }
      };
    };
  }]);




  // var handleError = function(data) {
  //   console.log(data);
  // };

  // app.factory('tweetMarkers', ['$http', function($http){
  //   return {
  //     getTweet: function(callback) {
  //       $http({
  //         method: 'GET',
  //         url: 'https://data.seattle.gov/resource/7stk-8j8w.json'
  //       })
  //       .success(callback)
  //       .error(handleError);
  //     }
  //   };
  // }]);
};
