const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); // native node module
const dotenv = require("dotenv"); // for using .env file in project
const app = express();

const port = 8080;

dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {

    // used to send html file to the client
    res.sendFile(__dirname + "/index.html");
});

// trigger when any post req is made on "/" root path
app.post("/", function (req, res) {

    const cityName = req.body.cityName;
    // getting content from body of the page, cityName is the name input field name
    const apiKey = process.env.OPEN_WEATHER_API;
    const units = "metric";


    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;


    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            
            res.write(`<h1>The temperature in ${cityName} is ${temp} degree</h1>`);
            res.write(`<br><p>weather is currently ${weatherDescription}</p>`);
            res.write(`<img src=${iconUrl}>`);
            res.send();
        });

    });

    // res.send("");
});


app.listen(port, function (req, res) {
    console.log(`Server started at ${port}`);
});