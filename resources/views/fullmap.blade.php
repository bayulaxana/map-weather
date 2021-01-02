@extends('layout.main')

@section('title')
  Map
@endsection

@section('internal-style')
<style>
  #map-segment {
    flex-grow: 2;
    margin-bottom: 0;
  }

  #mapid {
    height: 100%;
  }

  .full.height {
    display: flex;
    flex-direction: column;
  }
</style>
@endsection

@section('content')
  @include('layout.map')
@endsection

@section('javascript')
<script src="{{ asset('/js/map.js') }}"></script>
<script src="{{ asset('/js/weather.js') }}"></script>
<script>
  let [maplayer, tilelayer] = initializeMap('mapid');
  let mapmarker = null;
  L.control.zoom({ position: 'bottomright' }).addTo(maplayer);

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

</script>
@endsection