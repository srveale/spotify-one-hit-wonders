const express = require('express');
const router = express.Router();
const request = require('request');
const rp = require('request-promise')
const processTracks = require('../scripts/process-tracks');
const config = require('../config');

// const { redirect_uri, client_secret, client_id, mLabs_url } = require('../config');
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

// Database config
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// const dbUrl = 'mongodb://127.0.0.1:27017'
const Log = require('../models/Log');
const Token = require('../models/Token');

mongoose.connect(mLabs_url, function(mongooseErr, db) {
	if (mongooseErr) {
		console.log('mongooseErr', mongooseErr)
	}
	console.log('connected to mongo')
})

// Get an artists track popularity data from the artist name
router.get('/:artist', async function(req, res, next) {
	// Check if a fresh token exists
	const now = new Date;
	now.setHours(now.getHours() - 1);
	const freshTokens = await Token.find({date: {$gt: now}}, ()=>{});

	const freshAccessToken = freshTokens.length ? freshTokens[0].token : "";
	const encodedArtist = encodeURI(req.params.artist)

	// Get access token
	if (!freshAccessToken) {
		request.post(tokenOptions, (tokenError, tokenRes, tokenBody) => {
			const parsedTokenBody = JSON.parse(tokenBody);
			const tokenLog = new Token({
				token: parsedTokenBody['access_token'],
				date: new Date
			});
			tokenLog.save();

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
				const items = searchBody.artists.items;
				if (!items.length) {
					console.log('searchBody with no artists', searchBody)
					return res.send({ error: "No artists found, try again" })
				}

				const artistId = items[0].id;
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
					const log = new Log({
						artistId,
						artistName: processedData.artistName,
						isOHW: processedData.isOHW,
						fitParams: processedData.fitParams,
						date: new Date,
					});
					// log.save();
					res.send(processedData)
				})
			})
		})
	} else {
		// Fresh token exists
		const searchOptions = {
			url: `https://api.spotify.com/v1/search?q=${encodedArtist}&type=artist`,
			headers: {
				'Authorization': 'Bearer ' + freshAccessToken,
			},
			json: true,
			method: "POST"
		}
		request.get(searchOptions, (searchError, searchRes, searchBody) => {
			const items = searchBody.artists.items;
			if (!items.length) {
				console.log('searchBody with no artists', searchBody)
				return res.send({ error: "No artists found, try again" })
			}

			const artistId = items[0].id;
			// Get Track Data
			const trackOptions = {
				url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
				headers: {
					'Authorization': 'Bearer ' + freshAccessToken,
				},
				json: true,
				method: "POST"
			};
			request.get(trackOptions, (tracksError, tracksRes, tracksBody)=> {
				// Process track data and send it with response
				console.log('tracksBody', tracksBody.tracks.map(track=> track.popularity))
				const processedData = processTracks(tracksBody.tracks);
				const log = new Log({
					artistId,
					artistName: processedData.artistName,
					isOHW: processedData.isOHW,
					fitParams: processedData.fitParams,
					date: new Date,
				});
				// log.save();
				res.send(processedData)
			})
		})
	}
});

module.exports = router;