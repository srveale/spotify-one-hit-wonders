const processTracks = function (tracks) {
	return tracks.map(track => track.popularity)
}

module.exports = processTracks;