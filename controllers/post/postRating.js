const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

// import post model
const PostRating = require("../../models/Post-rating.model");
const Post = require("../../models/Post.model");
const { postRatingValidation } = require("../../services/validation_schema");

const postRating = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const { rating } = await postRatingValidation.validateAsync(req.body);
    const postId = req.params.id;
    const updatedRating = await PostRating.findOneAndUpdate(
      { post_id: postId, user: userId },
      { rating },
      { new: true, upsert: true }
    );
    const avg = await PostRating.aggregate([
      { $match: { post_id: ObjectId(postId) } },
      {
        $group: {
          _id: "$id",
          avg: { $avg: "$rating" },
        },
      },
    ]);
    await Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { ratings: updatedRating._id }, average_rating: avg[0]?.avg }
    );
    res.json({
      message: "success",
      data: {
        rating: updatedRating?.rating,
        averageRating: avg[0]?.avg,
        ratingCount: avg.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = postRating;
