const createError = require("http-errors");
const DashboardFeeds = require("../../models/DashboardFeed.model");

//importing the model
const Feed = require("../../models/Feed.model");
const Project = require("../../models/Project.model");

const deleteFeed = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findFeed = await DashboardFeeds.exists({ feed: id });
    if (findFeed) throw createError.Conflict(`Feed is use in the home page`);
    await Project.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteFeed;
