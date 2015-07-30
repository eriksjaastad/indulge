'use strict';

var socket = io.connect(window.location.hostname || 'http://127.0.0.1:3000');
module.exports = function(app) {
  app.controller('mapController', ['$scope', function($scope){

    console.log('socket connected');
    socket.on('output', function(lukesData) {
      $scope.tweets = lukesData;
      console.log(lukesData);

      // -----Make Google Map-----

      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(47.623581, -122.335661),
        // styles: stylesArray,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_CENTER
        }
      }
      $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var infoWindow = new google.maps.InfoWindow();

      //-----Make Google Markers-----

      $scope.markers = [];

      var infoWindow = new google.maps.InfoWindow();
      var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.longitude, info.latitute),
            title: info.text
        });

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>');
            infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);
      }

      for (var i = 0; i < lukesData.length; i++){
          createMarker(lukesData[i]);
      }

      $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
      }

      $scope.$apply();
    });
  }]);
};
