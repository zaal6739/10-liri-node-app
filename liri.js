//npm variables 
require("dotenv").load();
var fs = require("fs");
var request = require('request');
var moment = require('moment');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

//user input variables
var action = process.argv[2];
var value = process.argv[3];

//logic to decide which function to run
switch (action) {
	case 'concert-this':
		findConcert();
		break;

	case 'spotify-this-song':
		searchSong();
		break;

	case 'movie-this':
		grabMovie();
		break;

	case 'do-what-it-says':
		grabText();
		break;
};

function findConcert() {
	var artistLookup = value;
	for (i = 4; i < process.argv.length; i++) {
		artistLookup += '+' + process.argv[i];
	}
	
	//input request to the queryUrl to retrieve data
	var queryUrl = 'https://rest.bandsintown.com/artists/' + artistLookup + '/events?app_id=codingbootcamp';
	//send request to omdb
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			//console log the movie information returned
			var queryResponse = body;
			for (index = 0; index < queryResponse.length; index++) {
				console.log('\n------------------------------------------------------------\n\n')
				console.log('Venue: ' + JSON.parse(queryResponse)[index].venue.name);
				console.log('Location: ' + JSON.parse(queryResponse)[index].venue.city + ', ' + JSON.parse(queryResponse)[index].venue.country);
				console.log('Date of Event: ' + moment(JSON.stringify(JSON.parse(queryResponse)[index].datetime), 'YYYY/MM/DD').format('MM/DD/YYYY'));
			}
		}
	});
};

function searchSong(value) {
	var spotify = new Spotify({
		id: keys.spotifyKeys.id,
		secret: keys.spotifyKeys.secret
	});

	var songLookup = value;

	if (songLookup == null) {
		var songLookup = 'The Sign Ace of Base'
	} else {
		for (i = 4; i < process.argv.length; i++) {
			songLookup += '+' + process.argv[i];
		}
	}


	spotify.search({
		type: 'track',
		query: songLookup
	}, function (err, data) {
		if (err) {
			console.log('Error occured: ' + err);
			return;
		} else {

			console.log('\n------------------------------------------------------------\n');
			console.log('Artist: ' + data.tracks.items[0].artists[0].name);
			console.log('Song Name: ' + data.tracks.items[0].name);
			console.log('Preview Song: ' + data.tracks.items[0].preview_url);
			console.log('Album: ' + data.tracks.items[0].album.name);
			console.log('\n------------------------------------------------------------\n');
		}
	});
};

function grabMovie() {

	//handle if the user doesn't have a request or if the request is more than one word
	if (value == null) {

		var defaultMovie = 'Mr. Nobody';
		var movieRequest = defaultMovie.split(' ').join('+');

	} else {
		var movieRequest = value;
		for (i = 4; i < process.argv.length; i++) {
			movieRequest += '+' + process.argv[i];
		}

	}

	//input request to the queryUrl to retrieve data
	var queryUrl = 'http://www.omdbapi.com/?t=' + movieRequest + '&y=&plot=short&tomatoes=true&r=json&apikey=trilogy';

	//send request to omdb
	request(queryUrl, function (error, response, body) {
		if (!error && response.statusCode === 200)
		
		{
            //console log the movie information returned
            console.log('\n------------------------------------------------------------\n');
			console.log('Title:' + JSON.parse(body).Title);
			console.log('Year Released:' + JSON.parse(body).Year);
			console.log('IMDB Rating:' + JSON.parse(body).Ratings[0].Value);
			console.log('Rotten Tomatoes Rating:' + JSON.parse(body).Ratings[1].Value);
			console.log('Country:' + JSON.parse(body).Country);
			console.log('Language:' + JSON.parse(body).Language);
			console.log('Plot:' + JSON.parse(body).Plot);
            console.log('Actors:' + JSON.parse(body).Actors);
            console.log('\n------------------------------------------------------------\n');
		}
	})
};

function grabText() {

	fs.readFile('./random.txt', 'utf8', function read(err, data) {
		if (err) {
			throw err;
		} else {
			var txtString = data.split(',');
			var action = txtString[0].trim();
			var value = txtString[1].trim();
			console.log(txtString);
			console.log(action);
			console.log(value);

			switch (action) {
				case 'concert-this':
					findConcert(value);
					break;

				case 'spotify-this-song':
					searchSong(value);
					break;

				case 'movie-this':
					grabMovie(value);
					break;
			};
		}
	});

};


