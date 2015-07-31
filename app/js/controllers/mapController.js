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

//-----Make Clusters-----
// $('#map').gmap({'zoom': 2, 'disableDefaultUI':true}).bind('init', function(evt, map) {
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
          infoWindow.setContent('<p class="markerTitle icon-twitter"> - "' + marker.title + '"</p>');
          infoWindow.open($scope.map, marker);
        });

        $scope.markers.push(marker);
      }

      for (var i = 0; i < lukesData.length; i++){
        createMarker(lukesData[i]);
      }





      // $('#map').gmap({'zoom': 2, 'disableDefaultUI':true}).bind('init', function(evt, map) {

      //   $('#map').gmap('set', 'MarkerClusterer', new MarkerClusterer(map, $(this).gmap('get', 'markers')));
      //   // To call methods in MarkerClusterer simply call
      //   // $('#map_canvas').gmap('get', 'MarkerClusterer').callingSomeMethod();
      // });



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


      var listOfTweets = document.getElementsByClassName('tweetListView');

      var newListContent = document.createElement('section');
      newListContent.setAttribute('class','tweetListView');
      newListContent.innerHTML += '<p>"' + newTweet.text + '"</p><p class="icon-twitter"> on ' + newTweet.curDate + '</p>';
      //newListContent.innerHTML += '<p>"' + newTweet.text + '"</p><p class="icon-twitter"> on ' + formatMonth(newTweet.curMonth) + newTweet.curDay + ', ' + newTweet.curYear + ' at ' + formatTime(newTweet.curHour, newTweet.curMinute) + '</p>';
      tweetList.insertBefore(newListContent, listOfTweets[0]);

    });
  }]);
};

function formatMonth(month) {
  if (month == 1) {
    return 'Jan ';
  } else if (month == 2) {
    return 'Feb ';
  } else if (month == 3) {
    return 'Mar ';
  } else if (month == 4) {
    return 'Apr ';
  } else if (month == 5) {
    return 'May ';
  } else if (month == 6) {
    return 'Jun ';
  } else if (month == 7) {
    return 'Jul ';
  } else if (month == 8) {
    return 'Aug ';
  } else if (month == 9) {
    return 'Sept ';
  } else if (month == 10) {
    return 'Oct ';
  } else if (month == 11) {
    return 'Nov ';
  } else if (month == 12) {
    return 'Dec ';
  }
}

function formatTime(currentHour, currentMinute) {
  // if (currentMinute < 10) {
  //   currentMinute = "0" + currentMinute;
  // }
  if (currentHour > 12) {
    currentHour = currentHour - 12;
    return currentHour + ':' + currentMinute + ' PM';
  } else {
    return currentHour + ':' + currentMinute + ' AM';
  }
}
