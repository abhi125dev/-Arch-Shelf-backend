const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const getAllArchitects = async (req, res, next) => {
  try {
    const architects = await Project.aggregate([
      {
        $unwind: {
          path: "$architects",
        },
      },
      { $group: { _id: "$architects" } },
    ]);
    return res.json({
      message: "success",
      architects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllArchitects;
