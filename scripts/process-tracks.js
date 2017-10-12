const regression = require('regression');
const _ = require('lodash');

const checkIfOHW = require('./isOHW');

const processTracks = function (tracks) {

  let processedTracks = _.sortBy(tracks, (track) => -track.popularity);
  
  // Check for duplicate songs
  // Add 1/6th of the duplicate to the main track and remove the duplicate
  let firstTrack = processedTracks[0]
  processedTracks = processedTracks.filter((track, i) => {
    if (i==0) return true;
    if (track.name.indexOf(firstTrack.name) > -1) {
      processedTracks[0].popularity += processedTracks[i].popularity / 6;
      return false;
    }
    return true;
  })

  // Temporarily fill dummy data until https://github.com/spotify/web-api/issues/690 is resolved
  // The problem is that sometimes the less popular tracks come back with a popularity of zero
  // ToDo: fit the non-zero tracks, then use the fit to create new 

  // Get fit data
  let smallestPopularity = 101;
  let popularities = processedTracks.map(track => track.popularity);
  popularities.map(popularity => {
    if (popularity > 0 && popularity < smallestPopularity) smallestPopularity = popularity;
  })

  processedTracks.map((track, i) => {
      processedTracks[i].popularity = processedTracks[i].popularity ? processedTracks[i].popularity : smallestPopularity / (1 + i * i / 200);
  })

  popularities = popularities.map((popularity, i) => {
    return  popularity ? popularity : smallestPopularity / (1 + i * i / 200);
  });

  const fitParams = regression.exponential(popularities.map((pop, i) => [i, pop]), {precision: 3});
  const isOHW = checkIfOHW(tracks, fitParams);

  const artistName = _.get(tracks, '0.artists.0.name', "")
  console.log('artistName', artistName)
  console.log('ohw factor', Math.abs(fitParams.equation[1]) * 1000);
	return {
		processedTracks,
		fitParams,
    isOHW,
    artistName,
	}
}

module.exports = processTracks;