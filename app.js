window.addEventListener('load', () => {
  let long;
  let lat;
  let temperatureDescription = document.querySelector('.temperature-description');
  const temperatureDegree = document.querySelector('.temperature-degree');
  const locationTimezone = document.querySelector('.location-timezone');
  //   const temperatureSection = document.querySelector('.temperature');
  //   const temperatureSpan = document.querySelector('.temperature span');
  const humiditySpan = document.querySelector('.humidity span');
  const precipitationSpan = document.querySelector('.precipitation span');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/4b4a48fa0948aa2966733db3181f88e7/${lat},${long}?units=si`;
      console.log(api);

      axios
        .get(api, {
          timeout: 10000
        })
        .then(response => showOutput(response))
        .catch(err => console.log(err));
    });
  }
});
