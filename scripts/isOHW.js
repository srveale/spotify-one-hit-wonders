const isOHW = (trackData, fitParams) => {
  const hasHit = trackData.map(track=> track.popularity).some(pop => pop > 50);
  const onlyOneHit = Math.abs(fitParams.equation[1]) * 1000 > 100;

  return hasHit && onlyOneHit;
}

module.exports = isOHW