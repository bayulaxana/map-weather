let [maplayer, tilelayer] = initializeMap('mapid');
let mapmarker = null;
L.control.zoom({ position: 'bottomright' }).addTo(maplayer);

let apiSettings = {
  url: `https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?autocomplete=false&access_token=${ACCESS_TOKEN}`,
  onResponse: function(resp) {
    let response = {
      "results": [],
    };

    $.each(resp.features, function(index, item) {
      let text = item.text;
      let placeName = item.place_name;
      let lat = item.center[1];
      let lng = item.center[0];

      response["results"].push({
        "title": text,
        "description": placeName,
        lat: lat,
        lng: lng,
      });
    });
    return response;
  }
};

$('.ui.search')
  .search({
    type: 'standard',
    minCharacters: 3,
    apiSettings: apiSettings,
    onSelect: function(result, response) {
      goToLocation(result.lat, result.lng);
    }
  });

function goToLocation(lat, lng) {
  maplayer.flyTo([lat, lng], DEFAULT_ZOOM_LEVEL);
}

function changeMapView() {
  let mapViewBox = $('#map-view-select');
  if (!maplayer.hasLayer(tilelayer)) {
    return;
  }

  maplayer.removeLayer(tilelayer);
  switch (mapViewBox.val()) {
    case 'street-view':
      tilelayer = createTileLayer(MAP_STREET_VIEW);
      break;
    case 'satellite-view':
      tilelayer = createTileLayer(MAP_SATELLITE_VIEW);
      break;
    case 'satellite-street-view':
      tilelayer = createTileLayer(MAP_SATELLITE_STREET_VIEW);
      break;
  }
  tilelayer.addTo(maplayer);
}

function searchLocation(event) {
  let loc = $('#search-loc-input').val();
  
  if (loc == '' || !loc) {
    $('body').toast({
      message: 'Empty string..',
      showProgress: 'bottom',
      classProgress: 'yellow',
      position: 'bottom center',
    });
    return;
  }

  $('#map-segment').addClass('double loading');
  let api = getForwardGeocodingAPI(loc);
  fetch(api)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {      
      let result = data.features[0];
      let lng = result.center[0];
      let lat = result.center[1];
      maplayer.flyTo([lat, lng], DEFAULT_ZOOM_LEVEL);

      setTimeout(() => {
        $('#map-segment').removeClass('double loading');
      }, 1000);
    });
}

function updateMyLocation(latlng) {
  maplayer.flyTo(latlng, DEFAULT_ZOOM_LEVEL + 3);
  mapmarker = L.marker(latlng).addTo(maplayer);
  mapmarker.bindTooltip("You are around here");
  L.circle(latlng, {radius: 200}).addTo(maplayer);
}

function onGeolocationSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  
  updateMyLocation([lat, lng]);
  setTimeout(() => {
    $('#map-segment').removeClass('double loading');
  }, 1000);
}

function onGeolocationError() {
  alert('There is some error(s) while retreiving location');
  setTimeout(() => {
    $('#map-segment').removeClass('double loading');
  }, 1000);
}

function getMyLocation() {
  $('#map-segment').addClass('double loading');
  navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}
