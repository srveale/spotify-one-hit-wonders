const regression = require('regression');
const _ = require('lodash');

const processTracks = function (tracks) {
	const popularities = tracks.map(track => track.popularity).sort().reverse();
  const processedTracks = _.sortBy(tracks, 'popularity');
	const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});
	return {
		processedTracks,
		fitParams,
	}
}

module.exports = processTracks;