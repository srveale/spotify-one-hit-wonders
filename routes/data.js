var express = require('express');
var router = express.Router();

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
