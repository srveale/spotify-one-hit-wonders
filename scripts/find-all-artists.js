const request = require('request');
const _ = require('lodash');

const artists = require('../artists').artists;

const { redirect_uri, client_secret, client_id, mLabs_url } = require('../config');

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

artistArr = artists.split(',');

request.post(tokenOptions, (tokenError, tokenRes, tokenBody) => {
	const parsedTokenBody = JSON.parse(tokenBody);

	artistArr.splice(0, 5).map(artist => {
		console.log('getting artist, ', artist)
		// Get Artist Id
		const searchOptions = {
			url: `https://api.spotify.com/v1/search?q=${artist}&type=artist`,
			headers: {
				'Authorization': 'Bearer ' + parsedTokenBody['access_token']
			},
			json: true,
			method: "POST"
		}
		request.get(searchOptions, (searchError, searchRes, searchBody) => {
			console.log('got artist ID')
			const items = searchBody.artists.items;
			if (!items.length) {
				console.log('searchBody with no artists', searchBody)
			}

			const artistId = items[0].id;
			// Get Track Data
			const trackOptions = {
				url: `https://api.spotify.com/v1/artists/${encodeURI(artistId)}/top-tracks?country=CA`,
				headers: {
					'Authorization': 'Bearer ' + parsedTokenBody['access_token']
				},
				json: true,
				method: "POST"
			};
			console.log('getting artist data')
			request.get(trackOptions, (tracksError, tracksRes, tracksBody)=> {
				console.log('got artist data', tracksBody.length)
			})
		})
	})
})