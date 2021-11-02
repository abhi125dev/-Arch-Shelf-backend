const createError = require("http-errors");

// import post model
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const { ObjectId } = require("mongoose").Types;
const convertParams = require("../../helpers/convertParams");

const getPosts = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  const { query } = req;
  try {
    const filters = await convertParams(Post, query);
    const startIndex = (query._start && parseInt(query._start)) || 0;
    const viewSize = (query._limit && parseInt(query._limit)) || 10;
    const searchCriteria = filters.where;
    if (query.user_id) {
      searchCriteria.user = query.user_id;
    }
    if (query.isVerified && query.isVerified === "false") {
      searchCriteria.isVerified = false;
    }
    if (query.isVerified && query.isVerified === "true") {
      searchCriteria.isVerified = true;
    }
    const allPosts = await Post.aggregate([
      {
        $match: searchCriteria,
      },
      {
        $lookup: {
          from: "subscription",
          let: { user_id: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$subscription_to", "$$user_id"] },
                    { $eq: ["$subscription_from", ObjectId(userId)] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
              },
            },
          ],
          as: "is_subscribed",
        },
      },
      {
        $unwind: {
          path: "$is_subscribed",
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          created_at: 1,
          updated_at: 1,
          average_rating: 1,
          type: 1,
          is_subscribed: 1,
          price: 1,
          user: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
          media: {
            $cond: [
              { $eq: [ObjectId(userId), "$user._id"] },
              "$media",
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ["$type", "open"] },
                      then: "$media",
                    },
                    {
                      case: { $eq: ["$type", "subscription"] },
                      then: {
                        $cond: [
                          {
                            $eq: [{ $type: "$is_subscribed._id" }, "objectId"],
                          },
                          "$media",
                          "not subscribed",
                        ],
                      },
                    },
                    {
                      case: { $eq: ["$type", "premium"] },
                      then: {
                        $cond: [
                          {
                            $in: [ObjectId(userId), "$premium_group"],
                          },
                          "$media",
                          "premium post",
                        ],
                      },
                    },
                  ],
                  default: "not subscribed",
                },
              },
            ],
          },
        },
      },
      {
        $set: {
          has_access: {
            $cond: [
              { $in: ["$media", ["not subscribed", "premium post"]] },
              false,
              true,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "postrating",
          let: { post_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", ObjectId(userId)] },
                    { $eq: ["$post_id", "$$post_id"] },
                  ],
                },
              },
            },
          ],
          as: "user_rating",
        },
      },
      {
        $unwind: {
          path: "$user_rating",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "bookmark",
          let: { post_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", ObjectId(userId)] },
                    { $eq: ["$post", "$$post_id"] },
                  ],
                },
              },
            },
          ],
          as: "user_bookmark",
        },
      },
      {
        $unwind: {
          path: "$user_bookmark",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: startIndex },
      { $limit: parseInt(viewSize) },
    ]);
    const count = await Post.countDocuments();

    res.status(200).send({
      posts: allPosts,
      count: allPosts.length,
      post_total: count,
      // test,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = getPosts;
