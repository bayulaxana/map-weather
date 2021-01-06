<div class="ui compact top attached menu">
  <div class="item" onclick="getMyLocation()">
    <div class="ui primary labeled icon button">
      <i class="map icon"></i>
      My Location
    </div>
  </div>
  <select class="ui item selection dropdown" id="map-view-select" onchange="changeMapView()">
    <option selected value="street-view">Street View</option>
    <option value="satellite-view">Satellite View</option>
    <option value="satellite-street-view">Dual View</option>
  </select>
  <div class="right item">
    <div class="ui search" id="search-loc-input">
      <div class="ui icon input">
        <input class="prompt" type="text" placeholder="Search">
        <i class="search icon"></i>
      </div>
      <div class="results"></div>
    </div>
  </div>
</div>
<div class="ui bottom attached fitted segment" id="map-segment">
  <div id="mapid" style="z-index: 6;"></div>
</div>