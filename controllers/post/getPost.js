const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

// import post model
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");

const getPost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const postRes = await Post.findOne({ _id: ObjectId(req.params.id) });
    if (!postRes) throw createError.BadRequest("This post does not exist");
    const resp = await User.aggregate([
      {
        $match: { _id: postRes.user },
      },
      {
        $project: {
          has_access: {
            $cond: [
              {
                $or: [
                  { $eq: [ObjectId(userId), "$_id"] },
                  { $eq: [false, "$is_private"] },
                ],
              },
              true,
              {
                $cond: [{ $in: [ObjectId(userId), "$followers"] }, true, false],
              },
            ],
          },
        },
      },
    ]);
    if (!resp[0]?.has_access)
      throw createError.Forbidden(
        "This account is private, you need to follow them"
      );
    const post = await Post.aggregate([
      {
        $match: { _id: ObjectId(req.params.id) },
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
    ]);
    res.json({
      message: "success",
      data: post[0],
    });
  } catch (error) {
    console.log("error get post: ", error);
    next(error);
  }
};

module.exports = getPost;
