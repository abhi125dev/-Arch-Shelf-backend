const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

//importing the model
const Feed = require("../../models/Feed.model");

const getFeeds = async (req, res, next) => {
  const { query } = req;
  try {
    const startIndex = (query.start && parseInt(query.start)) || 0;
    const viewSize = (query.limit && parseInt(query.limit)) || 10;
    let filters;
    if (query.selected) {
      filters = {
        type: req.query.type,
        category: ObjectId(query.selected),
      };
    } else {
      filters = {
        type: req.query.type,
      };
    }
    if (query.keywordState) {
      filters.title = {
        $regex: `${query.keywordState}`,
        $options: "i",
      };
    }
    const feedList = await Feed.aggregate([
      { $match: filters },
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
        $project: {
          _id: 1,
          title: 1,
          media: 1,
          shortDescription: 1,
          url: 1,
          user: 1,
          category: 1,
          authorName: 1,
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
      { $sort: { created_at: -1 } },
      { $skip: startIndex },
      { $limit: parseInt(viewSize) },
    ]);
    const count = await Feed.countDocuments({
      type: req.query.type,
    });
    return res.status(200).json({
      message: "success",
      data: { feedList, count },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getFeeds;
