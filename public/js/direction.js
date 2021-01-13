// Globals
const locVariation = {
  CHOOSE_ON_MAP: 1,
  LOCATION: 2,
};

let states = {
  srcSelected: false,
  destSelected: false,
};

let G = {
  markerSrc: null,
  markerDst: null,
  coordSrc: null,
  coordDst: null,
  geoJSONLayer: null,
  directionResult: null,
  routeLineStyle: [
    {color: 'black', opacity: 0.15, weight: 9}, 
    {color: 'white', opacity: 0.8, weight: 6}, 
    {color: '#2962ff', opacity: 1, weight: 5}
  ],
}

// Geocoding API Settings
let apiSettings = {
  url: `https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?autocomplete=false&access_token=${ACCESS_TOKEN}`,
  onResponse: function(resp) {
    let response = {
      "results": [
        {
          "title": "Choose on map",
          "description": "Choose the location on map",
          "variation": locVariation.CHOOSE_ON_MAP,
        },
      ],
    };

    $.each(resp.features, function(index, item) {
      let text = item.text;
      let placeName = item.place_name;
      let lat = item.center[1];
      let lng = item.center[0];

      response["results"].push({
        "title": text,
        "description": placeName,
        "variation": locVariation.LOCATION,
        lat: lat,
        lng: lng,
      });
    });
    return response;
  }
};

let [maplayer, tilelayer] = initializeMap('mapid');
L.control.zoom({ position: 'bottomright' }).addTo(maplayer);
maplayer.on('click', onMapClick);

function startRouting() {
  if (G.directionResult != null) G.directionResult.remove();
  
  let opt = {
    waypoints: [
      L.latLng(G.coordSrc.lat, G.coordSrc.lng),
      L.latLng(G.coordDst.lat, G.coordDst.lng),
    ],
    routing: L.routing.mapbox(ACCESS_TOKEN),
    lineOptions: {
      styles: G.routeLineStyle,
    },
  }
  G.directionResult = L.Routing.control(opt).addTo(maplayer);
  G.directionResult.on('routesfound', onRoutesFound);
}

function onRoutesFound(direction) {
  let route = null;

  for (let i=0; i < direction.routes.length; i++) {
    route = direction.routes[i];
    break;
  }
  let coordinates = route.coordinates;
  let sortedByLatitude = coordinates.map(item => item);
  let sortedByLongitude = coordinates.map(item => item);

  sortedByLatitude.sort((a, b) => a.lat > b.lat);
  sortedByLongitude.sort((a, b) => a.lng > b.lng);

  let minLat = sortedByLatitude[0].lat;
  let maxLat = sortedByLatitude[sortedByLatitude.length - 1].lat;
  let minLng = sortedByLongitude[0].lng;
  let maxLng = sortedByLongitude[sortedByLongitude.length - 1].lng;

  // bounds
  let corner1 = L.latLng(minLat, minLng);
  let corner2 = L.latLng(maxLat, maxLng);
  let bounds = L.latLngBounds(corner1, corner2);

  maplayer.flyToBounds(bounds, {
    paddingBottomRight: [330, 0],
  });
}

// Handle source location
function onSourceSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordSrc = {lat: res.lat, lng: res.lng};

  if (G.markerSrc) G.markerSrc.remove(), G.markerSrc = null;
  G.markerSrc = L.marker([res.lat, res.lng]).addTo(maplayer);

  $('#search-loc-input-2').removeClass('disabled');
}

// Handle destination location
function onDestinationSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordDst = {lat: res.lat, lng: res.lng};

  if (G.markerDst) G.markerDst.remove(), G.markerDst = null;
  G.markerDst = L.marker([res.lat, res.lng]).addTo(maplayer);
  startRouting();
}

function resetGeoJson() {
  if (G.geoJSONLayer) G.geoJSONLayer.remove(), G.geoJSONLayer = null;
}

function resetMap() {
  if (G.markerSrc) G.markerSrc.remove(), G.markerSrc = null;
  if (G.markerDst) G.markerDst.remove(), G.markerDst = null;
  if (G.geoJSONLayer) G.geoJSONLayer.remove(), G.geoJSONLayer = null;
}

function onMapClick(event) {
  if (G.markerSrc && G.markerDst) {
    console.log("reset");
    resetMap();
  }

  let res = {
    lat: event.latlng.lat,
    lng: event.latlng.lng,
  };
  
  if (G.markerSrc) {
    G.markerDst = L.marker(event.latlng).addTo(maplayer);
    G.markerDst.bindPopup("Dest");
    onDestinationSelected(res, null);
    return;
  }

  G.markerSrc = L.marker(event.latlng).addTo(maplayer);
  G.markerSrc.bindPopup("Src");
  onSourceSelected(res, null);
}

$('#search-loc-input-1')
  .search({
    type: 'standard',
    apiSettings: apiSettings,
    onSelect: onSourceSelected,
  });

$('#search-loc-input-2')
  .search({
    type: 'standard',
    apiSettings: apiSettings,
    onSelect: onDestinationSelected,
  });