const WHEATER_API_KEY = '5f4d39d0ed31c073a59d01bfdb83db56';
const IMAGE_WEATHER = {
  rain: 'rain.jpg',
  sun: 'sun.jpg',
  mist: 'mist.jpg',
  clouds: 'clouds.jpg',
  clear: 'clear.jpg',
  snow: 'snow.jpg',
  haze: 'haze.jpg',
  thunderstorm: 'thunderstorm.jpg',
};

/**
 * 
 * @param {number} lat 
 * @param {number} lng 
 */
function getWeatherInfo(lat, lng) {
  let api = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${WHEATER_API_KEY}`;
  let wheaterData = fetch(api)
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      return data;
    });
  
  return wheaterData;
}

function getImageWeather(weather) {
  weather = weather.toLowerCase();

  if (IMAGE_WEATHER.hasOwnProperty(weather)) {
    return IMAGE_WEATHER[weather];
  }
  else {
    return IMAGE_WEATHER['sun'];
  }
}