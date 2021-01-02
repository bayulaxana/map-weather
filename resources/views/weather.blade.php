@extends('layout.main')

@section('title')
  Home
@endsection
@section('internal-style')
<style>
  #trip-list {
    height: 70vh;
    max-height: 70vh;
    overflow-y: scroll;
  }

  .weather.card.inverted {
    background: rgb(0,0,0);
    box-shadow: none;
    background-size: cover;
    transition: opacity 0.2s ease-in;
  }

  #mapid {
    height: 50vh;
  }
</style>
@endsection

@section('content')
<div class="ui grid full height">
  <div class="six wide column">
    <div class="ui basic padded segment full height" id="left-segment">
      <h2 class="ui header" id="left-segment-header">Menu</h2>
      <div class="ui divider"></div>
      <div class="ui message">
        <div class="header">
          Check Weather
        </div>
        <p>
          You can use the map to check the current weather of the desired location.
          Click the location on the map.
        </p>
      </div> <!-- Message -->
      <div class="ui padded segment" id="trip-list">
        <!-- Item -->
        <div class="ui divided items">
          <div class="item">
            <div class="content">
              <a class="header">12 Years a Slave</a>
              <div class="meta">
                <span class="cinema">Union Square 14</span>
              </div>
              <div class="description">
                <p></p>
              </div>
              <div class="extra">
                <div class="ui label">IMAX</div>
                <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="content">
              <a class="header">12 Years a Slave</a>
              <div class="meta">
                <span class="cinema">Union Square 14</span>
              </div>
              <div class="description">
                <p></p>
              </div>
              <div class="extra">
                <div class="ui label">IMAX</div>
                <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="content">
              <a class="header">12 Years a Slave</a>
              <div class="meta">
                <span class="cinema">Union Square 14</span>
              </div>
              <div class="description">
                <p></p>
              </div>
              <div class="extra">
                <div class="ui label">IMAX</div>
                <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="content">
              <a class="header">12 Years a Slave</a>
              <div class="meta">
                <span class="cinema">Union Square 14</span>
              </div>
              <div class="description">
                <p></p>
              </div>
              <div class="extra">
                <div class="ui label">IMAX</div>
                <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="content">
              <a class="header">12 Years a Slave</a>
              <div class="meta">
                <span class="cinema">Union Square 14</span>
              </div>
              <div class="description">
                <p></p>
              </div>
              <div class="extra">
                <div class="ui label">IMAX</div>
                <div class="ui label"><i class="globe icon"></i> Additional Languages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--  -->
  <div class="ten wide column">
    <div class="ui basic segment full height">
      <h2 class="ui header">Maps and Weather</h2>
      <div class="ui divider"></div>

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
      </div>
      @include('layout.map')
    </div>
  </div>
</div>
@endsection

@section('javascript')
<script src="{{ asset('/js/map.js') }}"></script>
<script src="{{ asset('/js/weather.js') }}"></script>
<script src="{{ asset('/js/dashboard.js') }}"></script>
@endsection