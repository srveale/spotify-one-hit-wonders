const request = require('request');
const _ = require('lodash');
let config;
if (!process.env.client_secret) {
	const config = require('../config')
}

const artists = require('../artists').artists;

const client_secret = process.env.client_secret || config.client_secret;
const client_id = process.env.client_id || config.client_id;
const mLabs_url = process.env.mLabs_url || config.mLabs_url;
console.log('client_secret, client_id, mLabs_url', client_secret, client_id, mLabs_url)

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
			request.get(trackOptions, (tracksError, tracksRes, tracksBody)=> {
			})
		})
	})
})