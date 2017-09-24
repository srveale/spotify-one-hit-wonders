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

// Get an artists track popularity data from the artist name
router.get('/:artist', function(req, res, next) {
	// Check if a fresh token exists
	const saved_access_token = require('../config.js').access_token;
	const encodedArtist = encodeURI(req.params.artist)
	console.log("encodedArtist", encodedArtist);

	// Get access token
	if (!saved_access_token) {
		request.post(tokenOptions, (tokenError, tokenRes, tokenBody) => {
			const parsedTokenBody = JSON.parse(tokenBody);
			console.log('tokenBody', tokenBody)

			// Get Artist Id
			const searchOptions = {
				url: `https://api.spotify.com/v1/search?q=${encodedArtist}&type=artist`,
				headers: {
					'Authorization': 'Bearer ' + parsedTokenBody['access_token']
				},
				json: true,
				method: "POST"
			}
			request.get(searchOptions, (searchError, searchRes, searchBody) => {
				if (!searchBody.artists.items.length) {
					return res.send({error: "No artists found"})
				}

				const artistId = searchBody.artists.items[0].id;

				// Get Track Data
				const trackOptions = {
					url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=CA`,
					headers: {
						'Authorization': 'Bearer ' + parsedTokenBody['access_token']
					},
					json: true,
					method: "POST"
				};
				request.get(trackOptions, (tracksError, tracksRes, tracksBody)=> {
					// Process track data and send it with response
					const processedData = processTracks(tracksBody.tracks);
					res.send(processedData)
				})

			})

		})
	}
});

module.exports = router;