const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const getAllCountries = async (req, res, next) => {
  try {
    const countries = await Project.aggregate([
      { $group: { _id: "$country" } },
    ]);
    return res.json({
      message: "success",
      countries,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllCountries;
