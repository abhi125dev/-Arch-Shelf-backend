const createError = require("http-errors");
const DashboardFeeds = require("../../models/DashboardFeed.model");

//importing the model
const Competition = require("../../models/Competitions.model");

const deleteCompetitions = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Competition.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCompetitions;
