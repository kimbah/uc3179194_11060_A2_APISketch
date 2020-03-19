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

      function showOutput (response) {
        console.log(response);
        let weather = response.data;
        console.log(weather);
        const {
          temperature,
          precipProbability,
          humidity,
          summary,
          icon
        } = weather.currently;
        console.log(temperature);

        // Set DOM Elements from the API
        temperatureDegree.textContent = temperature;
        precipitationSpan.textContent = precipProbability;
        humiditySpan.textContent = humidity;
        temperatureDescription.textContent = summary;
        locationTimezone.textContent = weather.timezone;

        // Change humidity to percentage
        const humidityPercentage = humidity * 100;
        humiditySpan.textContent = Math.floor(humidityPercentage);
        const preciptationPercentage = precipProbability * 100;
        precipitationSpan.textContent = Math.floor(preciptationPercentage);

        // Change temperature color based on range
        var element = document.getElementById('temp');
        var image = document.getElementById('image');
        if (temperature >= 35) {
          element.classList.add('red');
          image.classList.add('image-summer');
        } else if (temperature < 35 && temperature >= 28) {
          element.classList.add('green');
          image.classList.add('image-spring');
        } else if (temperature < 28 && temperature >= 15) {
          element.classList.add('yellow');
          image.classList.add('image-autum');
        } else if (temperature < 15) {
          element.classList.add('blue');
          image.classList.add('image-winter');
        } else {
          element.classList.add('blueviolet');
        }
      }
    });
  }
});
