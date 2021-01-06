@extends('layout.main')

@section('title')
  Home
@endsection
@section('internal-style')
<style>
  .weather.card.inverted {
    background: rgb(0,0,0);
    box-shadow: none;
    background-size: cover;
    transition: opacity 0.2s ease-in;
  }

  #mapid {
    height: 65vh;
  }
</style>
@endsection

@section('content')
<div class="ui grid vertically padded full height">
  <div class="ten wide column">
    <div class="ui basic padded segment full height">
      @include('layout.map')
      <div class="ui message">
        <div class="header">
          Check Weather
        </div>
        <p>
          You can use the map to check the current weather of the desired location.
          Click the location on the map.
        </p>
      </div> <!-- Message -->
    </div>
  </div>
  <!-- -->
  <div class="six wide column">
    <div class="ui basic padded segment full height" id="left-segment">
      <h2 class="ui header" id="left-segment-header">Weather Information</h2>
      <div class="ui fluid card inverted weather" id="weather-info-card">
        <div class="content">
          <div class="header">Weather</div>
          <div class="meta">Pick a location on map</div>
          <div class="ui horizontal statistic inverted">
            <div class="value">-</div>
            <div class="label">&deg;C</div>
          </div>
          <div class="description">
            Pick a location on map
          </div>
        </div>
        <div class="ui blue fast bottom attached filling progress">
          <div class="bar"></div>
        </div>
      </div>
      <div class="ui divider"></div>
      <div class="ui padded segment" id="weather-details">
        <h3>Details</h3>
        <!-- Item -->
        <div class="ui divided items">
          <div class="item">
            <div class="ui mini image">
              <img src="{{ asset('/image/icon/wind.png') }}" alt="">
            </div>
            <div class="middle aligned content">
              <div class="header" id="details-wind">Unavailable</div>
              <div class="metadata">Wind</div>
            </div>
          </div>
          <div class="item">
            <div class="ui mini image">
              <img src="{{ asset('/image/icon/humidity.png') }}" alt="">
            </div>
            <div class="middle aligned content">
              <div class="header" id="details-humidity">Unavailable</div>
              <div class="metadata">Humidity</div>
            </div>
          </div>
          <div class="item">
            <div class="ui mini image">
              <img src="{{ asset('/image/icon/clouds.png') }}" alt="">
            </div>
            <div class="middle aligned content">
              <div class="header" id="details-clouds">Unavailable</div>
              <div class="metadata">Cloud Percentage</div>
            </div>
          </div>
          <div class="item">
            <div class="ui mini image">
              <img src="{{ asset('/image/icon/pressure.png') }}" alt="">
            </div>
            <div class="middle aligned content">
              <div class="header" id="details-pressure">Unavailable</div>
              <div class="metadata">Pressure</div>
            </div>
          </div>
        </div> <!-- item -->
      </div>
    </div>
  </div>
</div>
@endsection

@section('javascript')
<script src="{{ asset('/js/map.js') }}"></script>
<script src="{{ asset('/js/weather.js') }}"></script>
<script src="{{ asset('/js/dashboard.js') }}"></script>
<script>
  $('.ui.progress').progress();

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
</script>
@endsection