const regression = require('regression');
const _ = require('lodash');

const checkIfOHW = require('./isOHW');

const processTracks = function (tracks) {
  const popularities = tracks.map(track => track.popularity).sort().reverse();
  console.log('track popularities', popularities)
  const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});

  const processedTracks = _.sortBy(tracks, (track) => -track.popularity);
  const isOHW = checkIfOHW(tracks, fitParams);
  console.log("isOHW", isOHW);

  const artistName = _.get(tracks, '0.artists.0.name', "")
  console.log('artistName while processing tracks', artistName)
	return {
		processedTracks,
		fitParams,
    isOHW,
    artistName,
	}
}

module.exports = processTracks;