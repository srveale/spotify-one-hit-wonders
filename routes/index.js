var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('in root route')
  	res.send('the data from the api');
});

module.exports = router;
