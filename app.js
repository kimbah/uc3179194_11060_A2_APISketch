const wDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

window.addEventListener('load', () => {
    let temperatureDescription = document.querySelector('.temperature-description span');
    const temperatureDegree = document.querySelector('.temperature-degree');
    const locationTimezone = document.querySelector('.location-timezone');
    const humiditySpan = document.querySelector('.humidity span');
    const precipitationSpan = document.querySelector('.precipitation span');

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                let key = '4b4a48fa0948aa2966733db3181f88e7';
                let currentLocation = lat + ',' + long;
                getWeather(currentLocation, key);
            },
            // If user blocks request for geoloaction show error and altert user
            function(error) {
                window.alert('Please allow location - else default location is Brisbane/Australia');
                console.warn('ERROR(' + error.code + '): ' + error.message);
                let currentLocation = -27.46794 + ',' + 153.02809;
                let key = '4b4a48fa0948aa2966733db3181f88e7';
                getWeather(currentLocation, key);
            }
        );
    }

    function getWeather(currentLocation, key) {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const api = `${proxy}https://api.darksky.net/forecast/${key}/${currentLocation}?units=si`;

        axios
            .get(api, {
                // timeout: 10000
            })
            .then(response => showOutput(response));

        function showOutput(response) {
            let weather = response.data;
            const { temperature, precipProbability, humidity, summary, icon } = weather.currently;

            // Set DOM Elements from the API (round temperature to 1 decimal place)
            temperatureDegree.textContent = Math.round(temperature);
            temperatureDescription.textContent = summary;
            locationTimezone.textContent = weather.timezone;
            // Change rain and humidity to percentage
            const preciptationPercentage = precipProbability * 100;
            precipitationSpan.textContent = Math.floor(preciptationPercentage);
            const humidityPercentage = humidity * 100;
            humiditySpan.textContent = Math.floor(humidityPercentage);

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

            // Set Icons
            setIcons(icon, document.querySelector('.icon'));

            // Render Weekly forecast table data
            document.getElementById('dailyForecast').innerHTML = renderWeeklyForecast(
                weather.daily
            );

            function renderWeeklyForecast(dailyForecast) {
                let rowcount;
                let resultsHTML = '<tr><th>Day</th><th>Conditions</th><th>Hi</th><th>Lo</th></tr>';
                rowcount = dailyForecast.data.length;
                if (rowcount > 8) {
                    rowcount = 8;
                }
                let i;
                for (i = 0; i < rowcount; i++) {
                    let time = new Date(dailyForecast.data[i].time * 1000);

                    let dayTime = wDay[time.getDay()];
                    let summary = dailyForecast.data[i].summary;
                    let tempHigh = `${Math.round(dailyForecast.data[i].temperatureHigh)}&deg`;
                    let tempLow = `${Math.round(dailyForecast.data[i].temperatureLow)}&deg`;

                    resultsHTML += renderRow(dayTime, summary, tempHigh, tempLow);
                }

                return resultsHTML;
            }

            // Render weekly forecast table rows
            function renderRow(dayTime, summary, tempHigh, lowtemp) {
                return `<tr><td>${dayTime}</td><td>${summary}</td><td>${tempHigh}</td><td>${lowtemp}</td></tr>`;
            }
        }

        // Display Skycons animated weather glyph
        function setIcons(icon, iconID) {
            const skycons = new Skycons({ color: 'white' });
            const currentIcon = icon.replace(/-/g, '_').toUpperCase();
            skycons.play();
            return skycons.set(iconID, Skycons[currentIcon]);
        }
    }
});
