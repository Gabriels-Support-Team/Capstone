export const getRatingColor = (rating) => {
  const normalizedRating = Math.min(1, Math.max(0, (rating - 5) / 5));

  //  red and green values based on the normalized rating
  const red = Math.min(255, Math.max(0, 255 - normalizedRating * 255));
  const green = Math.min(255, Math.max(0, normalizedRating * 255));

  return `rgb(${red}, ${green}, 0)`;
};
