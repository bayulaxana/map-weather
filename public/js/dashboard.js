let [maplayer, tilelayer] = initializeMap('mapid', [-7.23333, 112.73333]);
let mapmarker = null;

L.control.zoom({ position: 'bottomright' }).addTo(maplayer);
maplayer.on('click', onMapClick);

function getGradient(imagefile, rot) {
  if (rot == 90)
    return `linear-gradient(${rot}deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.17969194513742992) 100%),
      url('./image/${imagefile}') center center no-repeat`;
  else if (rot == 180)
    return `linear-gradient(${rot}deg, rgba(0,0,0,0.87156869583771) 0%, rgba(255,255,255,0.20770314961922265) 100%),
      url('./image/${imagefile}') no-repeat center center`;
}

function getCardHTML(dt) {
  let ret = `<div class="content">
              <div class="header">${dt.place}</div>
              <div class="meta">${dt.country}</div>
              <div class="ui horizontal statistic inverted">
                <div class="value">${dt.temperature}</div>
                <div class="label">&deg;C</div>
              </div>
              <div class="description">
                ${dt.weather}, ${dt.desc}
              </div>
            </div>
            <div class="ui blue fast bottom attached filling indeterminate progress">
              <div class="bar"></div>
            </div>`;
  return ret;
}

function goToLocation(lat, lng) {
  $('#map-segment').addClass('double loading');
  setTimeout(() => {
    $('#map-segment').removeClass('double loading');
    maplayer.flyTo([lat, lng], DEFAULT_ZOOM_LEVEL);
  }, 1000);
}

function updateMyLocation(latlng) {
  maplayer.flyTo(latlng, DEFAULT_ZOOM_LEVEL + 3);
  mapmarker = L.marker(latlng).addTo(maplayer);
  mapmarker.bindTooltip("You are around here");
  L.circle(latlng, {radius: 200}).addTo(maplayer);
}

function updatePinnedWeather(data) {
  $('#weather-info-card .progress').addClass('indeterminate');
  $('#weather-details').addClass('loading');
  
  let weatherdata = {
    temperature: data.main.temp,
    place: data.name,
    country: data.sys.country,
    weather: data.weather[0].main,
    desc: data.weather[0].description,
    pressure: data.main.pressure + ' hPa',
    humidity: data.main.humidity + '%',
    clouds: data.clouds.all + '%',
    wind: data.wind.speed + ' m/sec',
  };
  
  let cardHTML = getCardHTML(weatherdata);
  $('#weather-info-card').html(cardHTML);

  // update details
  $('#details-wind').html(weatherdata.wind);
  $('#details-pressure').html(weatherdata.pressure);
  $('#details-humidity').html(weatherdata.humidity);
  $('#details-clouds').html(weatherdata.clouds);
  
  setTimeout(() => {
    $('#weather-details').removeClass('loading');
    $('#weather-info-card .progress').removeClass('indeterminate');
  }, 1000);

  // setting bg
  $('#weather-info-card').css('background', getGradient(getImageWeather(weatherdata.weather), 90));
  $('#side-menu').css('background', getGradient(getImageWeather(weatherdata.weather), 180));
}

function onMapClick(event) {
  if (mapmarker) mapmarker.remove();
  let {lat, lng} = event.latlng;
  console.log(lat, lng);
  mapmarker = L.marker(event.latlng).addTo(maplayer);
  
  getWeatherInfo(lat, lng)
    .then(data => {
      updatePinnedWeather(data);
    });
}

function onGeolocationSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  
  updateMyLocation([lat, lng]);
  getWeatherInfo(lat, lng)
    .then(data => {
      updatePinnedWeather(data);
    });

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