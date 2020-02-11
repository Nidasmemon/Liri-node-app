require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


var command = process.argv[2];

var searchTerm = process.argv.slice(3).join(" ");

console.log(searchTerm);

function start() {

    switch (command) {
        case "concert-this":
            searchConcert()
            break;
        case "spotify-this-song":
            searchSpotify()
            break;
        case "movie-this":
            searchMovie()
            break;
        case "do-what-it-says":
            searchDoWhatSays()
            break;
    }

}

start();



function searchMovie() {

    if (searchTerm === "") {
        searchTerm = "Mr. Nobody";
        console.log("If you haven't watched \"Mr. Nobody,\" then you should. It's on Netflix!");
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl);

    axios.get(queryUrl).then(function (response) {
        if (response.data.Title !== undefined) {
            console.log("\n---------------\n")
            console.log("Title:", response.data.Title);
            console.log("Year released:", response.data.Year);
            console.log("Rating:", response.data.imdbRating);
            console.log("Rotten Tomatoes Rating:", response.data.Ratings[1].Value);
            console.log("Country produced:", response.data.Country);
            console.log("Language:", response.data.Language);
            console.log("Plot:", response.data.Plot);
            console.log("Actors:", response.data.Actors);
            console.log("")
        }

        else {
            console.log("Movie not found");
        }
    })
}

function searchSpotify() {

    if (searchTerm === "") {
        searchTerm = "The Sign Ace of Base";
    }

    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //   console.log(data.tracks.items); 
        var items = data.tracks.items;
        for (var i = 0; i < items.length; i++) {
            console.log("\n---------------\n")
            console.log("Artist:", items[i].artists[0].name)
            console.log("Song:", items[i].name)
            console.log("Preview link:", items[i].preview_url)
            console.log("Album:", items[i].album.name)
            console.log("")
        }
    });
}

function searchConcert() {
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
    // console.log(queryUrl);

    axios.get(queryUrl).then(function (response) {
        // console.log(response);
        var items = response.data;

        for (var i = 0; i < items.length; i++) {
            
            var time = items[i].datetime;
            var convertedTime = moment(time).format('L');
            console.log("\n---------------\n")
            console.log("Venue:", items[i].venue.name)
            console.log("Location:", items[i].venue.city + ", " + items[i].venue.country)
            console.log("Date:", convertedTime);
            console.log("");
        }
    })
}

function searchDoWhatSays() {
    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        console.log(data);
        command = data.split(",")[0];
        searchTerm = data.split(",")[1];
        searchTerm = searchTerm.replace(/"/g, "");

        start();
    })
}