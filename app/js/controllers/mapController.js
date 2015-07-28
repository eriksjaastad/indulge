'use strict';

module.exports = function(app) {

  app.controller('mapController', ['$scope', 'twitter', function($scope, twitter){

    var Http = twitter ();

    function makeTwitter () {
      Http.getter(function(data){
        console.log('got the info!');
        console.log(data);
        $scope.tweets = data;
        // console.log($scope.tweets);



        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info){
          var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.latitude, info.longitude),
            title: info.city_feature
          });
          marker.content = '<div class="infoWindowContent">' + info.common_name + '</div>';
          google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
          });
          $scope.markers.push(marker);
        }

        for (var i = 0; i < data.length; i++){
          createMarker(data[i]);
        }

        $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
        }









      });
    };

    makeTwitter();

    // var stylesArray = [
    //   {
    //     "featureType": "administrative",
    //     "elementType": "labels.text.fill",
    //     "stylers": [
    //       {
    //         "color": "#444444"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "landscape",
    //     "elementType": "all",
    //     "stylers": [
    //         {
    //             "color": "#f2f2f2"
    //         }
    //     ]
    //   },
    //   {
    //     "featureType": "poi",
    //     "elementType": "all",
    //     "stylers": [
    //       {
    //         "visibility": "off"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road",
    //     "elementType": "all",
    //     "stylers": [
    //       {
    //         "saturation": -100
    //       },
    //       {
    //         "lightness": 45
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.highway",
    //     "elementType": "all",
    //     "stylers": [
    //       {
    //         "visibility": "simplified"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "road.arterial",
    //     "elementType": "labels.icon",
    //     "stylers": [
    //       {
    //         "visibility": "off"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "transit",
    //     "elementType": "all",
    //     "stylers": [
    //       {
    //         "visibility": "off"
    //       }
    //     ]
    //   },
    //   {
    //     "featureType": "water",
    //     "elementType": "all",
    //     "stylers": [
    //       {
    //         "color": "#6ea2c7"
    //       },
    //       {
    //         "visibility": "on"
    //       }
    //     ]
    //   }
    // ]


    var cities = [
      {
          city : 'Seattle',
          desc : 'Best NW',
          lat : 47.623581,
          long : -122.335661
      },
      {
          city : 'New York',
          desc : 'This city is aiiiiite!',
          lat : 40.6700,
          long : -73.9400
      }
    ]

    //-----GOOGLE MAPS STUFF-----

    var mapOptions = {
      zoom: 11,
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

    //-----CREATING MARKERS-----

    // $scope.markers = [];

    // var infoWindow = new google.maps.InfoWindow();

    // var createMarker = function (info){
    //   var marker = new google.maps.Marker({
    //     map: $scope.map,
    //     position: new google.maps.LatLng(info.lat, info.long),
    //     title: info.city
    //   });
    //   marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
    //   google.maps.event.addListener(marker, 'click', function(){
    //     infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
    //     infoWindow.open($scope.map, marker);
    //   });
    //   $scope.markers.push(marker);
    // }

    // for (var i = 0; i < $scope.tweets.length; i++){
    //   createMarker($scope.tweets[i]);
    // }

    // $scope.openInfoWindow = function(e, selectedMarker){
    //   e.preventDefault();
    //   google.maps.event.trigger(selectedMarker, 'click');
    // }

    var infoWindow = new google.maps.InfoWindow();

  }]);

};
