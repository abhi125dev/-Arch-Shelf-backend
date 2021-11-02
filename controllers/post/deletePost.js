const createError = require("http-errors");
// import post model
const Post = require("../../models/Post.model");
const PostComment = require("../../models/Comment.model");
const PostRating = require("../../models/Post-rating.model");
const convertParams = require("../../helpers/convertParams");

const deletePost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const post = await Post.deleteOne({ _id: req.params.id });
    await PostRating.deleteMany({
      post_id: req.params.id,
    });
    await PostComment.deleteMany({
      post_id: req.params.id,
    });

    if (!post) {
      throw createError.InternalServerError();
    } else {
      const allPost = await Post.find({});
      res.json({ message: "success", data: allPost });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = deletePost;
