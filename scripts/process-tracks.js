const regression = require('regression');

const processTracks = function (tracks) {
	const popularities = tracks.map(track => track.popularity).sort().reverse();
	console.log("popularities", popularities);
	const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});
	return {
		popularities,
		fitParams,
	}
}

module.exports = processTracks;