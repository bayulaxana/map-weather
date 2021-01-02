<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>@yield('title') | Maps and Weather</title>

  <script src="https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>
  <link rel="stylesheet" href="{{ asset('/fomantic/semantic.css') }}">
  <link rel="stylesheet" href="{{ asset('/css/global.css') }}">
  <link rel="stylesheet" href="{{ asset('/leaflet/leaflet.css') }}">
  @yield('internal-style')
</head>
<body>
  <div class="ui left fixed vertical inverted menu" id="side-menu">
    <div class="item">
      {{-- <img class="ui mini image" src="./icon/icons8-location-64.png"> --}}
    </div>
    <a class="item" href="{{ url('/map') }}">
      <i class="map icon"></i>
      Map
    </a>
    <a class="item" href="{{ url('/weather') }}">
      <i class="cloud icon"></i>
      Weather
    </a>
  </div> <!-- Side menu -->

  <div class="content full height">
    {{-- <div class="ui top attached large menu">
      @yield('navbar')
    </div> --}}
    <div class="full height">
      @yield('content')
    </div>
  </div>

  <!-- required javascript -->
  <script src="{{ asset('/fomantic/semantic.min.js') }}"></script>
  <script src="{{ asset('/leaflet/leaflet.js') }}"></script>

  @yield('javascript')

  <script>
    $('.ui.dropdown').dropdown();
  </script>

</body>
</html>