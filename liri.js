
// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:
require("dotenv").config();
const axios = require("axios");
const moment = require("moment");

// const Spotify = require("node-spotify-api");
// var spotify = new Spotify(keys.spotify);

const keys = require("./keys.js");


// Add the code required to import the keys.js file and store it in a variable.
let userInput = process.argv[2];
let userSearch = process.argv;
let userSearchVal = process.argv.slice(3).join("+");


// Make it so liri.js can take in one of the following commands:
// concert-this

// spotify-this-song
// movie-this
// do-what-it-says

// node liri.js concert-this <artist/band name here>
const bandsInTownSearch = (artist) => {
    let concertQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log("concert URL: " + concertQueryURL);
    axios.get(concertQueryURL)
        .then(
            function (response) {
                // console.log(JSON.stringify(response.data, null, 4));
                let res = response.data;
                for (var i = 0; i < res.length; i++) {
                    console.log(`
                //     =======================
                //     Artist: ${res[i].lineup[0]}
                //     Venue Name: ${res[i].venue.name}
                //     Location: ${res[i].venue.city}, ${res[i].venue.region}  ${res[i].venue.country}
                //     Date: ${moment(res[i].datetime).format("MM/DD/YY")}
                `)
                }
            })
        .catch(function (error) {
            console.log(error);
        });
};

switch (userInput) {
    case "concert-this":
        bandsInTownSearch(userSearchVal);
        break;
    // case "spotify-this-song": 




};