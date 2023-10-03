const serverUrl = "https://api.openweathermap.org/data/2.5/";
const apiKey = '5d58f8843fb8dcc0c72955f98d829869';

$(document).ready(function () {
    $('#cityInput').keyup(function (event) {
        if (event.which === 13) return
        const query = $(this).val();

        if(query.length > 1) {
            $.ajax({
                url: `${serverUrl}/find?q=${query.toLocaleLowerCase()}&appid=${apiKey}`,
                method: 'GET',
                success: function (data) {
                    let suggestions = '';
                    data.list.forEach(function (city) {
                        suggestions += `<li>${city.name}, ${city.sys.country}</li>`;
                    });
                    $('#suggestions').html(suggestions);
                }
            });
        } else $('#suggestions').empty();

    });

    $('#suggestions').on('click', 'li', function () {
        const selectedCity = $(this).text();
        $('#cityInput').val(selectedCity);
        $('#suggestions').empty();
        getWeather();
    });

    $('#cityInput').keypress(function (event) {
        if (event.which === 13) {
            getWeather();
            $('#suggestions').empty();
        }
    });

    function getWeather() {
        const city = $('#cityInput').val();

        $.ajax({
            url: `${serverUrl}/weather?q=${city.toLocaleLowerCase()}&appid=${apiKey}&units=metric`,
            method: 'GET',
            success: function (data) {
                const weatherInfo = `
                            <h2>${data.name}, ${data.sys.country}</h2>
                            <p>Temperature: ${data.main.temp}°C</p>
                            <p>Max Temperature: ${data.main.temp_max}°C</p>
                            <p>Min Temperature: ${data.main.temp_min}°C</p>
                            <p>Feels Like: ${data.main.feels_like}°C</p>
                            <p>Wind Speed: ${data.wind.speed} m/s</p>
                            <p>Humidity: ${data.main.humidity}%</p>
                            <p>Pressure: ${data.main.pressure} hPa</p>
                        `;
                $('#weatherInfo').html(weatherInfo);
            }
        });

        $.ajax({
            url: `${serverUrl}/forecast?q=${city.toLocaleLowerCase()}&appid=${apiKey}&units=metric`,
            method: 'GET',
            success: function (data) {
                let forecast = '<h2>Weekly Forecast</h2>';
                data.list.forEach(function (forecastData) {
                    forecast += `
                                <p>${forecastData.dt_txt}: ${forecastData.main.temp}°C</p>
                            `;
                });
                $('#weeklyForecast').html(forecast);
            }
        });
    }
});

