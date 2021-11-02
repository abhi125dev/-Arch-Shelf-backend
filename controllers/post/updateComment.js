const createError = require("http-errors");

// import post model
const PostComment = require("../../models/Comment.model");
const convertParams = require("../../helpers/convertParams");

const updateComment = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    if (!req.body.comment) {
      throw createError.InternalServerError();
    }
    const comment = await PostComment.findOneAndUpdate(
      {
        _id: req.params.commentID,
        post_id: req.params.id,
      },
      { comment: req.body.comment },
      { new: true }
    );
    res.json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = updateComment;
