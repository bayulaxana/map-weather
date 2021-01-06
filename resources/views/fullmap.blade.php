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

  #search-loc-input {
    width: 250px;
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
<script src="{{ asset('/js/fullmap.js') }}"></script>
@endsection