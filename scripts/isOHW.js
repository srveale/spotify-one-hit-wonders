const isOHW = (trackData, fitParams) => {
  const hasHit = trackData.map(track=> track.popularity).some(pop => pop > 50);
  const ohwFactor = Math.abs(fitParams.equation[1]) * 1000;

  const onlyOneHit = ohwFactor > 100;

  const ohwBool = hasHit && onlyOneHit;
  switch (true) {
    case (ohwFactor < 20):
      const ohwString = ohwStrings.superLow;
      break;
    case (ohwFactor < 50):
      const ohwString = ohwStrings.low;
      break;
    case (ohwFactor < 75):
      const ohwString = ohwStrings.medium;
      break;
    case (ohwFactor < 100):
      const ohwString = ohwStrings.high;
      break;
    default:
      const ohwString = ohwStrings.superHigh;
      break;
  }
  return { ohwBool, ohwString };

module.exports = isOHW

const ohwStrings = {
  "superLow": "Not even close!",
  "low": "Not really",
  "medium": "Middle of the pack",
  "high": "Getting up there",
  "superHigh": "Certified One-Hit-Wonder"
}