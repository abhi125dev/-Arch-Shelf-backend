const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

//importing the model
const Feed = require("../../models/Feed.model");

const getFeed = async (req, res, next) => {
  try {
    const feed = await Feed.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "category",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $lookup: {
          from: "dashboardFeeds",
          localField: "_id",
          foreignField: "feed",
          as: "dashboardFeed",
        },
      },
      {
        $unwind: {
          path: "$dashboardFeeds",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          media: 1,
          shortDescription: 1,
          dashboardFeed: 1,
          url: 1,
          user: 1,
          authorName: 1,
          category: 1,
          body: 1,
          type: 1,
          created_at: 1,
          updated_at: 1,
          category: {
            _id: 1,
            name: 1,
          },
          user: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
        },
      },
    ]);
    return res.status(200).json({
      message: "success",
      data: feed[0],
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getFeed;
