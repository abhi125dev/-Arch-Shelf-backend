const createError = require("http-errors");

//importing the model
const DashboardFeed = require("../../models/DashboardFeed.model");

const getDashboardFeeds = async (req, res, next) => {
  try {
    const feeds = await DashboardFeed.find().populate({
      path: "feed",
      populate: {
        path: "category",
      },
    });
    // .populate({
    //   path: "feed",
    //   populate: {
    //     path: "user",
    //   },
    // });
    return res.status(200).json({
      message: "success",
      data: feeds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getDashboardFeeds;
