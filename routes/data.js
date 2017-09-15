/* Several steps before getting the actual data
 1. Get access token from https://accounts.spotify.com/api/token
2. Get artist id from https://api.spotify.com/v1/search
3. Get artist tracks from https://api.spotify.com/v1/artists/{id}/top-tracks

Question: How to handle the access token? Can't be for every search - I
 think it won't let me request that many. Where to store it? Later: How to refresh it?

TODO: Get artist Id from search endpoint

*/ 

const express = require('express');
const router = express.Router();
const request = require('request');
const processTracks = require('../scripts/process-tracks'); 

const { redirect_uri, client_secret, client_id } = require('../config');

const payload = client_id + ":" + client_secret;
const encodedPayload = new Buffer(payload).toString("base64");

const tokenOptions = {
	url: 'https://accounts.spotify.com/api/token',
	form: {
		grant_type: 'client_credentials'
	},
	headers: {
		"Authorization": 'Basic ' + encodedPayload
	},
	method: "POST"
}

/* GET users listing. */
router.get('/artist', function(req, res, next) {
	// Check if a fresh token exists
	const saved_access_token = require('../config.js').access_token;

	if (!saved_access_token) {
		request.post(tokenOptions, (tokenError, tokenRes, tokenBody) => {
			console.log('typof tokenBody', typeof tokenBody)
			console.log('tokenBody', tokenBody)
			console.log('access_token', tokenBody['access_token'])
			const authOptions = {
				url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/top-tracks?country=CA',
				headers: {
					'Authorization': 'Bearer ' + 'BQDCDJUjbncVCnQg2X1T7KhUbJJdbfZmxHwkunTlmx_drtPX3IuhCrr5lDQtXiUM60zNXnol7BCGiX3LRoSgtA'
				},
				json: true,
				method: "POST"
			};
			request.get(authOptions, (tracksError, tracksRes, tracksBody)=> {
				// Process track data and send it with response
				console.log('second body', tracksBody)
				const processedData = processTracks(tracksBody.tracks);
				res.send(processedData)
			})
		})
	} else {
		// Do the same thing but with the saved token
		const authOptions = {
			url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/top-tracks?country=CA',
			headers: {
				'Authorization': 'Bearer ' + saved_access_token //bodyFirst.access_token
			},
			json: true,
			method: "POST"
		};
		request.get(authOptions, (err, res, body)=> {
			console.log('second body', body)
		})
	}


	// res.json([{
	// 	id: 1,
	// 	username: "samsepi0l"
	// }, {
	// 	id: 2,
	// 	username: "D0loresH4ze"
	// }]);

});

module.exports = router;