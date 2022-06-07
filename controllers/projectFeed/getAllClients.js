const createError = require("http-errors");

//importing the model
const Project = require("../../models/Project.model");

const getAllClients = async (req, res, next) => {
  try {
    const clients = await Project.aggregate([
      {
        $unwind: {
          path: "$clients",
        },
      },
      { $group: { _id: "$clients" } },
    ]);
    return res.json({
      message: "success",
      clients,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllClients;
