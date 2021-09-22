var APIKey = "b3f7e8988fe623ea4b039fd9bd6d4c14";
var cityArr = [];

function showSavedData() {
    var cityArr = JSON.parse(localStorage.getItem('citylist'));
    for (var i = 0; i < cityArr.length; i++) {
        console.log("cityArr", cityArr);

        var a = $("<button>").attr({ "class": "list-group-item list-group-item-action", "id": cityArr[i] });

        a.text(cityArr[i]);
        $("#buttons-view").append(a);
        $("#" + cityArr[i]).on("click", function (event) {
            event.preventDefault();
            var cityName = this.id;
            getWeatherToday(cityName, "existing");
            getWeatherForecast(cityName, APIKey);
        });
    }
}

$('#find-city').on("click", function (event) {
    event.preventDefault();
    getWeatherTodayButton();
    getWeatherForecastButton(APIKey);
    saveCity();
});

function getWeatherTodayButton() {
    var cityInput = $("#city-input").val();
    getWeatherToday(cityInput, "new");
}

function getWeatherToday(cityInput, callType) {
    $("#weather-result").html("");
    cityArr.push(cityInput);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&appid=" + APIKey;
    var cityLat;
    var cityLon;
    $.ajax({
        url: queryURL,
        method: "GET",
    })
        .then(function (response) {
            var currentDate = moment().format('DD-MMM-YYYY');
            var weatherDiv = $('<div class="weatherdiv">');
            var getIcon = response.weather[0].icon;
            console.log("cek icon", getIcon);
            var iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + getIcon + ".png" });
            var city = $("<p>").html("<h1><b>" + response.name + "</h1></b>" + "<b>Date: " + currentDate + "</b> <br>" );
            city.append(iconURL);
            var tempC = (response.main.temp - 273.15);
            $('.temp').html(tempC.toFixed() + "Degree");
            var temp = $('<p>').html("Temperature: " + tempC.toFixed() + "&deg" + "C");
            var wind = $('<p>').text("Wind Speed: " + response.wind.speed + " MPH");
            var humidity = $('<p>').text("Humidity: " + response.main.humidity + "%");

            weatherDiv.append(city, temp, wind, humidity);
            $("#weather-result").prepend(city, temp, humidity, wind);
            cityLat = response.coord.lat;
            cityLon = response.coord.lon;
            getUVInd(APIKey, cityLat, cityLon);
            if (callType == "existing")
                return;
            for (var i = 0; i < city.length; i++) {
                var a = $("<button>").attr({ "class": "list-group-item list-group-item-action", "id": response.name });
                a.text(response.name);
                $("#buttons-view").append(a);
                $("#" + response.name).on("click", function (event) {
                    event.preventDefault();
                    var cityName = this.id;
                    saveCity();
                    getWeatherToday(cityName, "existing");
                });
            }
        })
}

function getWeatherForecastButton(APIKey) {
    var cityInput = $("#city-input").val();
    getWeatherForecast(cityInput, APIKey)
}

function getWeatherForecast(cityInput, APIKey) {
    $("#weather-forecast").html("");
    var queryURLFor = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + APIKey;
    $.ajax({
        url: queryURLFor,
        method: "GET",
    })
        .then(function (response) {
            var getForInfo = response.list;
            for (var i = 1; i <= getForInfo.length / 8; i++) {
                var getIcon = getForInfo[i * 7].weather[0].icon;
                var getForDate = getForInfo[i * 7].dt * 1000;
                var getWeatherDate = new Date(getForDate).getDate();
                var getWeatherMonth = new Date(getForDate).getMonth();
                var getWeatherYear = new Date(getForDate).getFullYear();
                var getForTemp = getForInfo[i * 7].main.temp;
                var getForHum = getForInfo[i * 7].main.humidity;

                var cardWeather = $('<div>').attr({ "class": "card bg-info shadow m-4 flex-container" });
                var cardBodyWeather = $('<div>').attr({ "class": "card-body" });
                var iconURL = $('<img>').attr({ "src": "https://openweathermap.org/img/w/" + getIcon + ".png" });
                var weatherForDate = $('<p>').html(getWeatherMonth + "/" + getWeatherDate + "/" + getWeatherYear);
                var weatherIcon = $("<p>").append(iconURL);
                var weatherForTemp = $('<p>').html("Temperature: " + getForTemp + "&deg" + "F");
                var weatherForHum = $('<p>').html("Humidity: " + getForHum + "% <br>");
                cardBodyWeather.append(weatherForDate, weatherIcon, weatherForTemp, weatherForHum);
                cardWeather.append(cardBodyWeather);
                $("#weather-forecast").append(cardWeather);
            }
        })
}

function saveCity() {
    localStorage.setItem("citylist", JSON.stringify(cityArr));
}
showSavedData();