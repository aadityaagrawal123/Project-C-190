let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    get_weather();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

$(function () {
    $("#navigate-button").click(function () {
        window.location.href = 'simulation.html'
    })
}) 

function get_weather () {
    $.ajax({
        url: `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.destination_lat}&lon=${coordinates.destination_lon}&appid=6be9fac2c278d09c65cdb4ae67421c26`,
        type: "get",
        success: function (response) {

            var place = response.name;
            var weather = `${response.weather[0].main}`;
            var weatherDescription = `${response.weather[0].description}`;

            var temp = `${Math.floor(parseInt(response.main.temp) - 273.15)}\u00B0C`;
            var humidity = `${Math.floor(parseInt(response.main.humidity))}`;
            var pressure = `${Math.floor(parseInt(response.main.pressure))}`;
            var wind_speed = `${Math.floor(parseInt(response.wind.speed))}`;
            var vis = parseInt(response.visibility);

            if ((vis>1000) && vis%1000 == 0) {
                visibility = `${Math.floor(vis/1000)} km`;
            }
            else if ((vis>1000) && vis%1000 != 0) {
                visibility = `${(vis/1000).toFixed(2)} km`;
            }
            else if (vis < 1000){
                visibility = `${vis} m`;
            }


            var wind_degrees = parseInt((response.wind.deg/22.5)+0.5);
            var directions = ["North (N)","North-Northeast (NNE)","North-East (NE)","East-Northeast (ENE)","East (E)","East-Southeast (ESE)","South-East (SE)","South-Southeast (SSE)","South (S)","South-Southwest (SSW)","South-West (SW)","West-Southwest (WSW)","West (W)","West-Northwest (WNW)","Noth-West (NW)","North-Northwest (NNW)"];
            var wind_direction = directions[(wind_degrees%16)];

            show_weather(weather, weatherDescription);

            $("#text-container").append(
                `
                <h2><u>Your selected location</u>: ${place}<h2>
                <h2><u>Place Weather</u>: ${weather}<h2>
                <h2><u>Weather Description</u>: ${weatherDescription}<h2>
                <h2><u>Temperature</u>: ${temp}<h2>
                <h2><u>Humidity</u>: ${humidity}%<h2>
                <h2><u>Atmospheric Pressure</u>: ${pressure} hPa<h2>
                <h2><u>Visibility</u>: ${visibility}<h2>
                <h2><u>Wind Speed</u>: ${wind_speed} knots<h2>
                <h2><u>Wind Direction</u>: ${wind_direction}<h2>
                `
            );

        }
    });
}

function show_weather (weather, weatherDescription) {

    var hours = new Date().getHours()
    var isday = hours > 6 && hours < 19

        if (weather === 'Thunderstorm' && (weatherDescription === 'light thunderstorm' || weatherDescription === 'thunderstorm' ||weatherDescription === 'heavy thunderstorm' || weatherDescription === 'ragged thunderstorm' || weatherDescription === 'thunderstorm with light drizzle' || weatherDescription === 'thunderstorm with drizzle' || weatherDescription === 'thunderstorm with heavy drizzle'))
        {
            var iconName = "thunderstorm";
        }
        else if (weather === 'Thunderstorm' && (weatherDescription === 'thunderstorm with light rain' || weatherDescription === 'thunderstorm with rain' ||weatherDescription === 'thunderstorm with heavy rain'))
        {
            var iconName = "thunderstorm-with-rain";
        }
        else if (weather === 'Rain')
        {
            var iconName = "heavy-rain";
        }
        else if (weather === 'Drizzle')
        {
            var iconName = "light-rain";
        }
        else if (weather === 'Snow')
        {
            var iconName = "snow";
        }
        else if (weather === 'Clouds' && (weatherDescription === 'few clouds') && isday)
        {
            var iconName = "partly-cloudy";
        }
        else if (weather === 'Clouds' && (weatherDescription != 'few clouds') && isday)
        {
            var iconName = "cloudy";
        }
        else if (weather === 'Clouds' && !isday)
        {
            var iconName = "cloudy-night";   
        }
        else if (weather === 'Clear' && isday)
        {
            var iconName = "sunny";
        }
        else if (weather === 'Clear' && !isday)
        {
            var iconName = "night";
        }
        else if (weather === 'Haze')
        {
            var iconName = "haze";
        }
        else if (weather === 'Mist' || weather === 'Fog')
        {
            var iconName = "mist";
        }
        else if (weather === 'Dust' ||weather === 'Sand' || weather === 'Ash' || weather === 'Smoke')
        {
            var iconName = "dust";
        }
        else if (weather === 'Squall')
        {
            var iconName = "squall";
        }
        else if (weather === 'Tornado')
        {
            var iconName = "tornado";
        }

        var source = `./assets/${iconName}.png`;
        
        document.getElementById("weather_image").src = source;

        }  