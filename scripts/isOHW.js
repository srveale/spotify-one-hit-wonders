const isOHW = (trackData, fitParams) => {
  const hasHit = trackData.map(track=> track.popularity).some(pop => pop > 50);
  const ohwFactor = Math.abs(fitParams.equation[1]) * 1000;

  const onlyOneHit = ohwFactor > 100;

  const ohwBool = hasHit && onlyOneHit;
  let ohwString = "";
  switch (true) {
    case (ohwFactor < 20):
      ohwString = ohwStrings.superLow;
      break;
    case (ohwFactor < 50):
      ohwString = ohwStrings.low;
      break;
    case (ohwFactor < 75):
      ohwString = ohwStrings.medium;
      break;
    case (ohwFactor < 100):
      ohwString = ohwStrings.high;
      break;
    default:
      ohwString = ohwStrings.superHigh;
      break;
  }
  return { ohwBool, ohwString };
}

module.exports = isOHW

const ohwStrings = {
  "superLow": "Not even close!",
  "low": "Very low",
  "medium": "Middle of the pack",
  "high": "Approaching one-hit-wonder status",
  "superHigh": "Certified One-Hit-Wonder!",
  "ungodly": "Off the charts! ...once"
}