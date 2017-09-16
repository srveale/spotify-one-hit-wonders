// Several steps before getting the actual data
// 1. Get access token from https://accounts.spotify.com/api/token
// 2. Get artist id from https://api.spotify.com/v1/search
// 3. Get artist tracks from https://api.spotify.com/v1/artists/{id}/top-tracks

// Question: How to handle the access token? Can't be for every search - I
// think it won't let me request that many. Where to store it? Later: How to refresh it?

var express = require('express');
var router = express.Router();
const request = require('request');

/* GET users listing. */
router.get('/artist', function(req, res, next) {
	// Expects a keyword on req.body, eg "Muse"
	// Calls the api and gets all track data
	// runs fitting function
	// returns tracking data and fit data, including OHW param
	res.json([{
		id: 1,
		username: "samsepi0l"
	}, {
		id: 2,
		username: "D0loresH4ze"
	}]);


});

module.exports = router;


