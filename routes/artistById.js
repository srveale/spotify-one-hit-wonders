const express = require('express');
const router = express.Router();
const request = require('request');
const rp = require('request-promise')
const processTracks = require('../scripts/process-tracks');

let config;
// fallback if heroku does feed us the config
if (!process.env.client_secret) {
	config = require('../config')
}

// const { redirect_uri, client_secret, client_id, mLabs_url } = require('../config');
const client_secret = process.env.client_secret || config.client_secret;
const client_id = process.env.client_id || config.client_id;
const mLabs_url = process.env.mLabs_url || config.mLabs_url;

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

const Log = require('../models/Log');
const Token = require('../models/Token');

// Get an artists track popularity data from the artist name
router.get('/:id/:artistName', async function(req, res, next) {
	const artistId = req.params.id
	const artistName = req.params.artistName;
	console.log('artistId', artistId)
	console.log('artistName 1', artistName )


	// There should be a fresh token for this function, since
	// You get here immediately after another search
	const now = new Date;
	now.setHours(now.getHours() - 1);
	const freshTokens = await Token.find({date: {$gt: now}}, ()=>{});
	const token = freshTokens.length ? freshTokens[0].token : "";

	getSingleArtist(token, artistId, artistName, res);

});


const getSingleArtist = (token, artistId, artistName, res) => {
	console.log('artistName 2', artistName )
	const trackOptions = {
		url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=CA`,
		headers: {
			'Authorization': 'Bearer ' + token
		},
		json: true,
		method: "POST"
	};
	request.get(trackOptions, (tracksError, tracksRes, tracksBody)=> {
		// Process track data and send it with response
		// console.log('tracksbody', tracksbody)
		const processedData = processTracks(tracksBody.tracks);
		// Override artistname, since we know for sure from the front end
		processedData.artistName = artistName;

		console.log('artistName 3', artistName )
		const log = new Log({
			artistId,
			artistName,
			isOHW: processedData.isOHW,
			fitParams: processedData.fitParams,
			date: new Date,
		});
		// log.save();
		res.send(processedData);
	})
}

module.exports = router;