const ACCESS_TOKEN = 'pk.eyJ1IjoiYmF5dWxheGFuYSIsImEiOiJja2pheXU3ajUyc3p4MzBucDVlcGFmZXFsIn0.k8xeYkPvsMmCWzakVMkTJQ';
const MAP_STREET_VIEW = 'mapbox/streets-v11';
const MAP_SATELLITE_VIEW = 'mapbox/satellite-v9';
const MAP_SATELLITE_STREET_VIEW = 'mapbox/satellite-streets-v11';
const DEFAULT_ZOOM_LEVEL = 13;
const DEFAULT_MAP_VIEW = MAP_STREET_VIEW;

/**
 * 
 * @param {string} elem 
 * @param {Array<number>} latlng
 */
function initializeMap(elem, latlng = null) {
  let maplayer = L.map(elem, {
    zoomControl: false,
  });

  if (latlng) maplayer.setView(latlng, DEFAULT_ZOOM_LEVEL);
  else maplayer.setView([-7.23333, 112.73333], DEFAULT_ZOOM_LEVEL);

  let tilelayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: DEFAULT_MAP_VIEW,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN,
  });

  tilelayer.addTo(maplayer);
  return [maplayer, tilelayer];
}

/**
 * 
 * @param {string} location 
 */
function getForwardGeocodingAPI(location) {
  let locstr = encodeURI(location);
  let api = `https://api.mapbox.com/geocoding/v5/mapbox.places/${locstr}.json?autocomplete=false&access_token=${ACCESS_TOKEN}`;
  return api;
}

function getDirectionAPI(src, dst) {
  let apistr = `https://api.mapbox.com/directions/v5/mapbox/driving/${src.lng},${src.lat};${dst.lng},${dst.lat}?alternatives=false&geometries=geojson&steps=false&access_token=${ACCESS_TOKEN}`;
  return apistr;
}

/**
 * 
 * @param {string} mapview
 */
function createTileLayer(mapview) {
  let newlayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: mapview,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ACCESS_TOKEN,
  });

  return newlayer;
}