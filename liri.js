require("dotenv").load();
var fs = require("fs");
var twitter = require('twitter');
var request=require('request');

// var spotify = new Spotify(keys.spotify);
var keys = require('./keys.js');


//user input variables
var action = process.argv[2];
var value = process.argv[3];



switch(action) {
   case 'concert-this':
    findConcert();
    break;

    case 'spotify-this-song':
    searchSong();
    break;

   case 'movie-this': 
    grabMovie();  
    break;
};

function findConcert() {

var artistLookup = value;

for (i=4;i<process.argv.length;i++) {

                artistLookup += '+' + process.argv[i];
                                    }
console.log(artistLookup)
                            
//input request to the queryUrl to retrieve data
var queryUrl = 'https://rest.bandsintown.com/artists/' + artistLookup+ '/events?app_id=codingbootcamp';
        //send request to omdb
            request(queryUrl,function(error,response,body) {
            if( !error && response.statusCode === 200)
                            {
        //console log the movie information returned
        console.log('Name of Venue:' +JSON.parse(body).id);                   
        console.log('Name of Venue:' +JSON.parse(body).venue.name);
                            }
                   })
};

function searchSong() {
    var spotify = require('spotify');
    spotify.search({type:'track',query: value}, function(err,data) {
        if (err) {
            console.log('Error occured: ' +err);
            return;
        } else if (value == null) {
            
        }
    })
}


function grabMovie() {
    
//handle if the user doesn't have a request or if the request is more than one word
   if(value == null) {

                     var defaultMovie = 'Mr. Nobody';
                     var movieRequest= defaultMovie.split(' ').join('+');
                   
                    }   
        else        {
                    var movieRequest = value;
                    for (i=4;i<process.argv.length;i++) {
                    movieRequest += '+' + process.argv[i];}
                    console.log(movieRequest)
                    }

//input request to the queryUrl to retrieve data
    var queryUrl = 'http://www.omdbapi.com/?t=' + movieRequest + '&y=&plot=short&tomatoes=true&r=json&apikey=trilogy';

//send request to omdb
    request(queryUrl,function(error,response,body) {
    if( !error && response.statusCode === 200)
                    {
//console log the movie information returned
                    console.log('Title:' +JSON.parse(body).Title);
                    console.log('Year Released:' +JSON.parse(body).Year);
                    console.log('IMDB Rating:' +JSON.parse(body).Ratings[0].Value);
                    console.log('Rotten Tomatoes Rating:' +JSON.parse(body).Ratings[1].Value);
                    console.log('Country:' +JSON.parse(body).Country);
                    console.log('Language:' +JSON.parse(body).Language);
                    console.log('Plot:' +JSON.parse(body).Plot);
                    console.log('Actors:' +JSON.parse(body).Actors);
                    }
           })
};