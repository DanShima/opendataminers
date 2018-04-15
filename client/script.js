
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 59.34, lng: 18.06},
      zoom: 7
    });
    map.data.loadGeoJson('vagarbate.geojson');
    map.data.addListener('click', function(e) {
      console.log(e.feature.f);
    });
  }