const createError = require("http-errors");
// import post model
const Comment = require("../../models/Comment.model");
const Post = require("../../models/Post.model");
const convertParams = require("../../helpers/convertParams");

const postComment = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    if (!req.body.comment) {
      throw createError.InternalServerError();
    }
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      throw createError.BadRequest();
    }
    const comment = new Comment({
      post_id: req.params.id,
      user: userId,
      comment: req.body.comment,
    });
    comment.save();
    res.json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = postComment;
