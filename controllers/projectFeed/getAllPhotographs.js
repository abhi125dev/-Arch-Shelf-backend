const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const photographs = async (req, res, next) => {
  try {
    const photographs = await Project.aggregate([
      {
        $unwind: {
          path: "$photographs",
        },
      },
      { $group: { _id: "$photographs" } },
    ]);
    return res.json({
      message: "success",
      photographs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = photographs;
