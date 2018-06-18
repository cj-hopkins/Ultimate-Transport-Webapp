var map;

function initMap() {
  var map_center = {
    lat:53.349805, 
    lng: -6.260310 
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: map_center,
    zoom: 13
  });
}
