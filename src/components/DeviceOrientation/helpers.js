export const constrainToRange = (value, rangeMin, rangeMax) =>
  Math.min(Math.max(value, rangeMin), rangeMax);
