'use strict';
var socket = io.connect(process.env.SOCKET_IO_CONNECTION);
module.exports = function(app) {
  app.controller('mapController', ['$scope', function($scope){
    socket.on('output', function(tweetData) {
      $scope.tweets = tweetData;
      $scope.zoomTweet = function(lat, longe) {
        console.log(lat, longe);
        //$scope.map = $('#map').gmap({ 'zoom' : 12, 'center': '47.623581, -122.335661', 'styles' : stylesArray });
        var center = new google.maps.LatLng(40.623581,-122.335661);
        $scope.map.setCenter(center);
      };

      
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
      ];

      $scope.map = $('#map').gmap({ 'zoom' : 12, 'center': '47.623581, -122.335661', 'styles' : stylesArray }).bind('init', function(evt, map){
        for (var i = 0; i < tweetData.length; i++){
//-----Make Google Markers-----
          $('#map').gmap('addMarker', {id: i, 'position': new google.maps.LatLng(tweetData[i].latitude, tweetData[i].longitude), 'icon': '../images/marker.png'}).click(function() {
            $('#map').gmap('openInfoWindow', { 'content' : tweetData[this.id].text }, this);
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
            'position': new google.maps.LatLng(newTweet.latitude, newTweet.longitude), 'icon': '../images/marker.png'
          }).click(function() {
            $('#map').gmap('openInfoWindow', { 'content' : newTweet.text }, this);
          });
      //get current date
      var curTime = new Date();

      //access sidebar tweet list
      var listOfTweets = document.getElementsByClassName('tweetListView');

      //construct new tweet element
      var newListContent = document.createElement('section');
      newListContent.setAttribute('class','tweetListView');
      
      //construct new tweet text
      var tweetText = document.createElement('p');
      tweetText.textContent = '"' + newTweet.text + '"';
      
      //construct new tweet date
      var tweetDate = document.createElement('p');
      tweetDate.setAttribute('class', 'icon-twitter');
      tweetDate.textContent = ' on ' + formatMonth(curTime.getMonth()) + formatDay(curTime.getDate()) + ', ' + curTime.getFullYear() + ' at ' + formatTime(curTime.getHours(), curTime.getMinutes());

      //build & append tweet
      newListContent.appendChild(tweetText);
      newListContent.appendChild(tweetDate);
      tweetList.insertBefore(newListContent, listOfTweets[0]);
    });
  }]);
};

//-----Date Formatting-----
function formatMonth(month) {
  if (month == 0) {
    return 'Jan ';
  } else if (month == 1) {
    return 'Feb ';
  } else if (month == 2) {
    return 'Mar ';
  } else if (month == 3) {
    return 'Apr ';
  } else if (month == 4) {
    return 'May ';
  } else if (month == 5) {
    return 'Jun ';
  } else if (month == 6) {
    return 'Jul ';
  } else if (month == 7) {
    return 'Aug ';
  } else if (month == 8) {
    return 'Sept ';
  } else if (month == 9) {
    return 'Oct ';
  } else if (month == 10) {
    return 'Nov ';
  } else if (month == 11) {
    return 'Dec ';
  }
}

function formatDay(date) {
  date = date < 10 ? '0' + date : date;
  return date;
}

function formatTime(currentHour, currentMinute) {
  currentMinute = currentMinute < 10 ? '0' + currentMinute : currentMinute;
  
  if (currentHour > 12) {
    currentHour = currentHour - 12;
    return currentHour + ':' + currentMinute + ' PM';
  } else {
    return currentHour + ':' + currentMinute + ' AM';
  }
}
