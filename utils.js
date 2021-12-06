const convertStringToArray = (input) =>
  input.split(",").map((item) => item.toLowerCase().trim());

module.exports = { convertStringToArray };
