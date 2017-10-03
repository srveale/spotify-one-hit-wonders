const regression = require('regression');
const _ = require('lodash');

const checkIfOHW = require('./isOHW'); //wtf wont this work

const processTracks = function (tracks) {
  const popularities = tracks.map(track => track.popularity).sort().reverse();
  const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});

  const processedTracks = _.sortBy(tracks, (track) => -track.popularity);
  const isOHW = checkIfOHW(tracks, fitParams);
  console.log("isOHW", isOHW);

  const artistName = _.get(tracks, '0.artists.0.name', "")
	return {
		processedTracks,
		fitParams,
    isOHW,
    artistName,
	}
}

module.exports = processTracks;