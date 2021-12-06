const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const getAllMaterials = async (req, res, next) => {
  try {
    const materials = await Project.aggregate([
      {
        $unwind: {
          path: "$materials",
        },
      },
      { $group: { _id: "$materials" } },
    ]);
    return res.json({
      message: "success",
      materials,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllMaterials;
