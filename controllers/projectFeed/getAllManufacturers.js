const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const getAllManufacturers = async (req, res, next) => {
  try {
    const manufacturers = await Project.aggregate([
      {
        $unwind: {
          path: "$manufacturers",
        },
      },
      { $group: { _id: "$manufacturers" } },
    ]);
    return res.json({
      message: "success",
      manufacturers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllManufacturers;
