const createError = require("http-errors");

//importing the model
const DashboardFeed = require("../../models/DashboardFeed.model");

const getDashboardFeeds = async (req, res, next) => {
  try {
    // const feeds = await DashboardFeed.find().populate({
    //   path: "feed",
    //   populate: {
    //     path: "category",
    //   },
    // });
    const feeds = await DashboardFeed.aggregate([
      {
        $lookup: {
          from: "feed",
          localField: "feed",
          foreignField: "_id",
          as: "feed1",
        },
      },
      { $unwind: { path: "$feed1", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "project",
          localField: "feed",
          foreignField: "_id",
          as: "project1",
        },
      },
      { $unwind: { path: "$project1", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          type: 1,
          feed: {
            $cond: {
              if: { $eq: ["$type", "feed"] },
              then: "$feed1",
              else: "$project1",
            },
          },
        },
      },
      {
        $lookup: {
          from: "category",
          localField: "feed.category",
          foreignField: "_id",
          as: "feed.category",
        },
      },
      { $unwind: { path: "$feed.category", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "user",
          localField: "feed.user",
          foreignField: "_id",
          as: "feed.user",
        },
      },
      { $unwind: { path: "$feed.user", preserveNullAndEmptyArrays: true } },
    ]);
    return res.status(200).json({
      message: "success",
      data: feeds,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getDashboardFeeds;
