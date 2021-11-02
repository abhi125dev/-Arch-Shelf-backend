const createError = require("http-errors");

// import verify token model and user model
const DashboardFeed = require("../../models/DashboardFeed.model");

const addDashboardFeed = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const count = await DashboardFeed.countDocuments();
    if (count >= 4)
      throw createError.Conflict(
        "Number of blog in the home page is 4 So, we can't proceed further."
      );
    const findFeedId = await DashboardFeed.findOne({
      feed: req.body.feed,
    });

    if (findFeedId) throw createError.Conflict("Feed is already exist.");

    const addDashboardFeeds = new DashboardFeed({
      feed: req.body.feed,
      addedBy: userId,
    });
    // Save post to DB
    const addFeeds = await addDashboardFeeds.save();

    res.status(200).json({
      success: true,
      data: addFeeds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addDashboardFeed;
