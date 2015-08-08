'use strict';
var socket = io.connect(process.env.SOCKET_IO_CONNECTION);
module.exports = function(app) {
  app.controller('mapController', ['$scope', function($scope){
    console.log('socket connected');
    socket.on('output', function(lukesData) {
      $scope.tweets = lukesData;
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

      $scope.map = $('#map').gmap({ 'zoom' : 12, 'center': '47.623581, -122.335661', 'styles' : stylesArray }).bind('init', function(evt, map){
        for (var i = 0; i < lukesData.length; i++){
//-----Make Google Markers-----
          $('#map').gmap('addMarker', {id: i, 'position': new google.maps.LatLng(lukesData[i].longitude, lukesData[i].latitude)}).click(function() {
            $('#map').gmap('openInfoWindow', { 'content' : lukesData[this.id].text }, this);
          });

        }
        $('#map').gmap('set', 'MarkerClusterer', new MarkerClusterer(map, $(this).gmap('get', 'markers'), {'maxZoom': 18}));
      });

      $scope.markers = [];
      $scope.$apply();
    });
//----------------
    socket.on('newTweet', function(newTweet) {

      $('#map').gmap('addMarker', {
            'position': new google.maps.LatLng(newTweet.latitude, newTweet.longitude)
          }).click(function() {
            $('#map').gmap('openInfoWindow', { 'content' : newTweet.text }, this);
          });

      var listOfTweets = document.getElementsByClassName('tweetListView');

      var newListContent = document.createElement('section');
      newListContent.setAttribute('class','tweetListView');
      newListContent.innerHTML += '<p>"' + newTweet.text + '"</p><p class="icon-twitter"> on ' + newTweet.curDate + '</p>';
      tweetList.insertBefore(newListContent, listOfTweets[0]);

    });
  }]);
};



