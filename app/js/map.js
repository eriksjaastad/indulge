function initialize() {
  var mapOptions = {
    center: { lat: 47.6297, lng: -122.3331},
    zoom: 11
  };
  var map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
