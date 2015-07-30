'use strict';

var socket = io.connect(process.env.SOCKET_IO_CONNECTION);

module.exports = function(app) {
  app.controller('mapController', ['$scope', function($scope){

    console.log('socket connected');
    socket.on('output', function(lukesData) {
      $scope.tweets = lukesData;
      console.log(lukesData);

      // -----Make Google Map-----

      // Map Styling

      var stylesArray = [
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#e9e5dc"}]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [{"visibility": "on"},{"color": "#b8cb93"}]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "poi.business",
          "elementType": "all",
          "stylers": [{"visibility": "simplified"}]
        },
        {
          "featureType": "poi.medical",
          "elementType": "all",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "all",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{"color": "#ccdca1"}]
        },
        {
          "featureType": "poi.sports_complex",
          "elementType": "all",
          "stylers": [{"visibility": "on"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{"hue": "#ff0000"}, {"saturation": -100}, {"lightness": 99}]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{"color": "#808080"}, {"lightness": 54}, {"visibility": "off"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#767676"}]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"saturation": 43},{"lightness": -11},{"color": "#89cada"}]
        }
      ]

      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(47.623581, -122.335661),
        styles: stylesArray,
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

    socket.on('newTweet', function(newTweet) {
      var infoWindow = new google.maps.InfoWindow();
      var createMarker = function (info) {
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

        $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
        }

        $scope.$apply();
      };
      createMarker(newTweet);
      //console.log(newTweet.text);
      var getNode = function(element) {
        return document.querySelector(element);
      };

      var tweetList = getNode('#tweetList');

      //var topOfList = getNode('#tweetList');

      var newListContent = document.createElement('section');
      newListContent.setAttribute('class','tweetListView');
      newListContent.innerHTML += '<p>"' + newTweet.text + '"</p><p class="icon-twitter"> at ' + newTweet.curDate;
      tweetList.insertBefore(newListContent, tweetList[0]);

    });
  }]);
};
