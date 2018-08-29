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

  // const artistName = _.get(tracks, '0.artists.0.name', "")
  // If the top song is a collaboration, the first name could be wrong
  const artistNamePossibilities = tracks.map(track => track.artists[0].name);
  const artistName = mode(artistNamePossibilities)
	return {
		processedTracks,
		fitParams,
    isOHW,
    artistName,
	}
}

// https://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

module.exports = processTracks;