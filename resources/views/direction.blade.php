@extends('layout.main')

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
<div class="ui compact top attached menu">
  <div class="item">
    <div class="ui search" id="search-loc-input-1">
      <div class="ui labeled icon input">
        <div class="ui label">Source</div>
        <input class="prompt" type="text" placeholder="Search source point...">
        <i class="search icon"></i>
      </div>
      <div class="results"></div>
    </div>
  </div>
  <!-- -->
  <div class="item">
    <div class="ui search disabled" id="search-loc-input-2">
      <div class="ui labeled icon input">
        <div class="ui label">Destination</div>
        <input class="prompt" type="text" placeholder="Search destination point...">
        <i class="search icon"></i>
      </div>
      <div class="results"></div>
    </div>
  </div>
  <!-- -->
</div>
<div class="ui bottom attached fitted segment" id="map-segment">
  <div id="mapid" style="z-index: 6; position: relative;"></div>
</div>    
@endsection

@section('javascript')
<script src="{{ asset('/js/map.js') }}"></script>
<script src="{{ asset('/js/weather.js') }}"></script>
<script src="{{ asset('/js/direction.js') }}"></script>
@endsection