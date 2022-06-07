const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const year = async (req, res, next) => {
  try {
    const year = await Project.aggregate([{ $group: { _id: "$year" } }]);
    return res.json({
      message: "success",
      year,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = year;
