
// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();

// Make it so liri.js can take in one of the following commands:
// concert-this ---- DONE
// spotify-this-song
// movie-this
// do-what-it-says

/////////////////////////////////////////////////

const axios = require("axios");
const moment = require("moment");
const keys = require("./keys.js");
const fs = require('fs');

const Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);


let userInput = process.argv[2];
let userSearchVal = process.argv.slice(3).join(" ");


//////////////////////////////////////////////////


// node liri.js concert-this <artist/band name here>
// - Name of the venue
// - Venue location
// - Date of the Event (use moment to format this as "MM/DD/YYYY")

const bandsInTownSearch = (artist) => {
    let concertQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    // console.log("concert URL: " + concertQueryURL);
    axios
    .get(concertQueryURL)
        .then(
            function (response) {
                let res = response.data;
                for (var i = 0; i < res.length; i++) {
                    console.log(`
                //     =======================
                //     ARTIST: ${res[i].lineup[0]}
                //     VENUE NAME: ${res[i].venue.name}
                //     LOCATION: ${res[i].venue.city}, ${res[i].venue.region}  ${res[i].venue.country}
                //     DATE: ${moment(res[i].datetime).format("MM/DD/YY")}
                `)
                }
            })
        .catch(function (error) {
            console.log("Band Name Not Found: " + error);
        });
};


// node liri.js spotify-this-song '<song name here>'
// - This will show the following information about the song in your terminal/bash window
// - Artist(s)
// - The song's name
// - A preview link of the song from Spotify
// - The album that the song is from
// - If no song is provided then your program will default to "The Sign" by Ace of Base.

const spotifySearch = (song) => {
    if(!song){ 
        song = "The Sign, Ace of Base"; //Default search param in case no song is specified
    }
    spotify
    .search({ type: 'track', query: song, limit: 8 })
    .then(function(response) {
        let res = response.tracks.items;
        for (let i = 0; i < res.length; i++){
            console.log(`
            =======================
            NAME: ${res[i].artists[0].name}
            SONG TITLE: ${res[i].name}
            PREVIEW LINK: ${res[i].external_urls.spotify}
            ALBUM TITLE: ${res[i].album.name}
            `)

        }
    })
    .catch(function(error) {
        console.log("Song or Artist Not Found. Try searching like this:   Song Title, Artist Name   :" + error);
    })
};


// node liri.js movie-this '<movie name here>'
//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Rotten Tomatoes Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.

const OMDBsearch = (movieInfo) => {
    if(!movieInfo){
        movieInfo = "Mr. Nobody"; //Default search param in case no movie is specified
    }
    let movieQueryURL = "http://www.omdbapi.com/?t=" + movieInfo + "&apikey=trilogy";
    axios
    .get(movieQueryURL)
    .then(function(response){
        let res = response.data;
        // console.log(response.data);
        console.log(`
        ===========================
        TITLE: ${res.Title}
        YEAR: ${res.Year}
        RATINGS: ${res.Ratings[0].Source}: ${res.Ratings[0].Value}, ${res.Ratings[1].Source}: ${res.Ratings[1].Value}
        COUNTRY: ${res.Country}
        LANGUAGE: ${res.Language}
        PLOT: ${res.Plot}
        ACTORS: ${res.Actors}
        `)
    })
    .catch(function (error) {
        console.log(error);
    });
}
    


// node liri.js do-what-it-says
// - Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// - It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// - Edit the text in random.txt to test out the feature for movie-this and concert-this.
const doIt = () => {
    fs.readFile("random.txt", "utf8", function(err, data){
        if(err){
            console.log(err)
        };
    // console.log(data);
    var dataArr = data.split(",");
    // console.log(dataArr);
    let userInput = dataArr[0];
    let userSearchVal = dataArr[1];
    // commandLog(userInput + ", " + userSearchVal);
    processInputs(userInput, userSearchVal);
    });
};




function commandLog (value){
    fs.appendFile("log.txt", " \n " + value, function(err) {
        if(err){
            console.log(err)
        }
        console.log("Logged: " + value);
    })
};


//Where the magic begins.... aka, here's how LIRI knows which route to take with the info User provides.
function processInputs(userInput, userSearchVal) {
    switch (userInput) {
        case "concert-this":
            bandsInTownSearch(userSearchVal);
            commandLog(userInput + ", " + userSearchVal);
            break;
        case "spotify-this-song": 
            spotifySearch(userSearchVal);
            commandLog(userInput + ", " + userSearchVal);
            break;
        case "movie-this":
            OMDBsearch(userSearchVal);
            commandLog(userInput + ", " + userSearchVal);
            break;
        case "do-what-it-says":
            doIt();
            break;
        default: 
        console.log("Oops! Something went wrong! Try your search again.");
    };
};


//Let's get this party started.....
processInputs(userInput, userSearchVal);