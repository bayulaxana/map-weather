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

// Handle source location
function onSourceSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordSrc = {lat: res.lat, lng: res.lng};

  $('#search-loc-input-2').removeClass('disabled');
}

// Handle destination location
function onDestinationSelected(res, resp) {
  if (res.variation == locVariation.CHOOSE_ON_MAP) return;
  G.coordDst = {lat: res.lat, lng: res.lng};
}

async function getDirection(api) {
  const response = await fetch(api);
  const json = await response.json();
  return json;
}

$('#search-loc-input-1')
  .search({
    type: 'standard',
    minCharacters: 3,
    apiSettings: apiSettings,
    onSelect: onSourceSelected,
  });

$('#search-loc-input-2')
  .search({
    type: 'standard',
    minCharacters: 3,
    apiSettings: apiSettings,
    onSelect: onDestinationSelected,
  });

let geoJSON = {
  "routes": [
    {
      "weight_name": "auto",
      "weight": 2129.422,
      "duration": 1539.751,
      "distance": 8216.869,
      "legs": [
        {
          "steps": [],
          "admins": [
            {
              "iso_3166_1_alpha3": "IDN",
              "iso_3166_1": "ID"
            }
          ],
          "duration": 1539.751,
          "distance": 8216.869,
          "weight": 2129.422,
          "summary": "Jalan Ngaglik, Jalan Putro Agung"
        }
      ],
      "geometry": {
        "coordinates": [
          [
            112.737221,
            -7.247883
          ],
          [
            112.736685,
            -7.247732
          ],
          [
            112.736896,
            -7.24693
          ],
          [
            112.741984,
            -7.247625
          ],
          [
            112.742827,
            -7.2456
          ],
          [
            112.742771,
            -7.244831
          ],
          [
            112.747482,
            -7.244578
          ],
          [
            112.751401,
            -7.24558
          ],
          [
            112.75056,
            -7.248646
          ],
          [
            112.750648,
            -7.248951
          ],
          [
            112.755441,
            -7.249286
          ],
          [
            112.757901,
            -7.248666
          ],
          [
            112.767596,
            -7.251113
          ],
          [
            112.768708,
            -7.248707
          ],
          [
            112.769148,
            -7.242281
          ],
          [
            112.776401,
            -7.223172
          ],
          [
            112.777047,
            -7.220116
          ],
          [
            112.777235,
            -7.220142
          ],
          [
            112.776847,
            -7.222102
          ]
        ],
        "type": "LineString"
      }
    }
  ],
  "waypoints": [
    {
      "distance": 12.285,
      "name": "Jalan Kawatan VI",
      "location": [
        112.737221,
        -7.247883
      ]
    },
    {
      "distance": 4.96,
      "name": "Jalan Haji Mohammad Noer",
      "location": [
        112.776847,
        -7.222102
      ]
    }
  ],
  "code": "Ok",
  "uuid": "n_DcRg_Z1C7_ys9s02TwteOHGHDlzKYW70YBNjUG7UMf6oMeGNTHxw=="
};

let route = null;
for (let i=0; i < geoJSON.routes.length; i++) {
  route = geoJSON.routes[i];
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

let myStyle = {
  "color": "#1A73E8",
  "weight": 7,
};

let geoJSONLayer = L.geoJSON(geometry, {
  style: myStyle,
}).addTo(maplayer);

maplayer.flyToBounds(bounds);

//
L.Control.MyControl = L.Control.extend({
  onAdd: function(map) {
    var el = L.DomUtil.create('div', 'ui card');

    el.innerHTML =
      `<div class="content">
        <div class="header">Project Timeline</div>
        <div class="ui items">
          <div class="item">
            <div class="ui mini image">
              <img src="{{ asset('/image/icon/wind.png') }}" alt="">
            </div>
            <div class="middle aligned content">
              <div class="header" id="details-wind">Unavailable</div>
            <div class="metadata">Wind</div>
          </div>
        </div>
        </div>
      </div>`;

    return el;
  },

  onRemove: function(map) {
    // Nothing to do here
  }
});

L.control.myControl = function(opts) {
  return new L.Control.MyControl(opts);
}

// L.control.myControl({
//   position: 'topleft'
// }).addTo(maplayer);