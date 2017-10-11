const regression = require('regression');
const _ = require('lodash');

const checkIfOHW = require('./isOHW');

const processTracks = function (tracks) {
  let popularities = tracks.map(track => track.popularity).sort().reverse();

  // Temporarily fill dummy data
  let smallestPopularity = 101;
  popularities.map(popularity => {
    if (popularity > 0 && popularity < smallestPopularity) smallestPopularity = popularity;
  })

  popularities = popularities.map(popularity => {
    return  popularity ? popularity : smallestPopularity / 1.5;  
  });
  console.log('track popularities', popularities)
  const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});

  let processedTracks = _.sortBy(tracks, (track) => -track.popularity);
  processedTracks.map((track, i) => {
    processedTracks[i].popularity = processedTracks[i].popularity ? processedTracks[i].popularity : smallestPopularity / 1.5;
  })
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