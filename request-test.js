const request = require('request');

const redirect_uri = "http://localhost:8888/callback";
const client_secret = 'haha not even'
const client_id = "no token 4 u"

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


request.post(tokenOptions, (errFirst, resFirst, bodyFirst) => {
	console.log('first body', bodyFirst.access_token)
	const authOptions = {
		url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/top-tracks?country=CA',
		headers: {
			'Authorization': 'Bearer ' + 'BQBnzIXPY7vgPxnjIweEODB1TuIdZIc5qiGZLE-Xi0SMSsFeijBfbbCTicFkT3n1CCj4sH2mtfTqTejkqGiw6A' //bodyFirst.access_token
		},
		json: true,
		method: "POST"
	};
	request.get(authOptions, (err, res, body)=> {
		console.log('second body', body)
	})
})

[73, 64, 62, 57, 56, 53, 52, 51, 51, 50]

