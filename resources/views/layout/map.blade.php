<div class="ui compact top attached menu">
  <a class="item" onclick="getMyLocation()">
    <i class="map marker alternate icon"></i>
    My Location
  </a>
  <select class="ui item selection dropdown" id="map-view-select" onchange="changeMapView()">
    <option selected value="street-view">Street View</option>
    <option value="satellite-view">Satellite View</option>
  </select>
  <div class="right item">
    <div class="ui action input">
      <input type="text" placeholder="Search place" id="search-loc-input">
      <div class="ui button" onclick="searchLocation(event)">Go</div>
    </div>
  </div>
</div>
<div class="ui bottom attached fitted segment" id="map-segment">
  <div id="mapid" style="z-index: 6;"></div>
</div>