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

// Handle source location
function onSourceSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordSrc = {lat: res.lat, lng: res.lng};

  if (G.markerSrc) G.markerSrc.remove(), G.markerSrc = null;
  G.markerSrc = L.marker([res.lat, res.lng]).addTo(maplayer);
  resetGeoJson();

  $('#search-loc-input-2').removeClass('disabled');
}

// Handle destination location
function onDestinationSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordDst = {lat: res.lat, lng: res.lng};

  if (G.markerDst) G.markerDst.remove(), G.markerDst = null;
  G.markerDst = L.marker([res.lat, res.lng]).addTo(maplayer);

  let api = getDirectionAPI(G.coordSrc, G.coordDst);
  getDirection(api)
    .then(direction => {
      G.directionResult = direction;
      updateMapDirection(direction);
    });
}

function resetGeoJson() {
  if (G.geoJSONLayer) G.geoJSONLayer.remove(), G.geoJSONLayer = null;
}

function resetMap() {
  if (G.markerSrc) G.markerSrc.remove(), G.markerSrc = null;
  if (G.markerDst) G.markerDst.remove(), G.markerDst = null;
  if (G.geoJSONLayer) G.geoJSONLayer.remove(), G.geoJSONLayer = null;
}

// update the map layer
function updateMapDirection(direction) {
  resetGeoJson();
  let route = null;

  for (let i=0; i < direction.routes.length; i++) {
    route = direction.routes[i];
    break;
  }

  let geometry = route.geometry;
  let sortedByLongitude = geometry.coordinates.map(item => item);
  let sortedByLatitude = geometry.coordinates.map(item => item);

  sortedByLatitude.sort((a, b) => {
    return a[1] > b[1];
  });

  sortedByLongitude.sort((a, b) => {
    return a[0] > b[0];
  });

  let minLat = sortedByLatitude[0][1];
  let maxLat = sortedByLatitude[sortedByLatitude.length - 1][1];
  let minLng = sortedByLongitude[0][0];
  let maxLng = sortedByLongitude[sortedByLongitude.length - 1][0];

  // bounds
  let corner1 = L.latLng(minLat, minLng);
  let corner2 = L.latLng(maxLat, maxLng);
  let bounds = L.latLngBounds(corner1, corner2);
  let layerStyle = {"color": "#2962ff", "weight": 7,};

  let duration = Math.ceil(route.duration/60);
  let distance = Math.ceil(route.distance/1000);
  let html =
    `<p><b>Estimated time: </b>${duration} minute(s)</p>
    <p><b>Approximate distance: </b>${distance} km</p>`;

  G.geoJSONLayer = L.geoJSON(geometry, {style: layerStyle}).addTo(maplayer);
  G.geoJSONLayer.bindTooltip(html);
  maplayer.flyToBounds(bounds);
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

async function getDirection(api) {
  const response = await fetch(api);
  const json = await response.json();
  return json;
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

// L.Control.MyControl = L.Control.extend({
//   onAdd: function(map) {
//     var el = L.DomUtil.create('div', 'ui card');

//     el.innerHTML =
//       `<div class="content">
//         <div class="header">Project Timeline</div>
//         <div class="ui items">
//           <div class="item">
//             <div class="ui mini image">
//               <img src="{{ asset('/image/icon/wind.png') }}" alt="">
//             </div>
//             <div class="middle aligned content">
//               <div class="header" id="details-wind">Unavailable</div>
//             <div class="metadata">Wind</div>
//           </div>
//         </div>
//         </div>
//       </div>`;

//     return el;
//   },

//   onRemove: function(map) {
//     // Nothing to do here
//   }
// });

// L.control.myControl = function(opts) {
//   return new L.Control.MyControl(opts);
// }

// L.control.myControl({
//   position: 'topleft'
// }).addTo(maplayer);