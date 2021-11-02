const createError = require("http-errors");
// import post model
const PostComment = require("../../models/Comment.model");
const convertParams = require("../../helpers/convertParams");

const deleteComment = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const comment = await PostComment.deleteOne({
      post_id: req.params.id,
      user: userId,
      _id: req.params.commentID,
    });
    if (!comment) {
      throw createError.InternalServerError();
    }
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteComment;
