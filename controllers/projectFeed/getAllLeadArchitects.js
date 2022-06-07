const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const leadArchitects = async (req, res, next) => {
  try {
    const leadArchitects = await Project.aggregate([
      {
        $unwind: {
          path: "$leadArchitects",
        },
      },
      { $group: { _id: "$leadArchitects" } },
    ]);
    return res.json({
      message: "success",
      leadArchitects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = leadArchitects;
