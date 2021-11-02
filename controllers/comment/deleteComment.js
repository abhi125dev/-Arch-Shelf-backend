const createError = require("http-errors");
// import post model
const Comment = require("../../models/Comment.model");
const convertParams = require("../../helpers/convertParams");

const deleteComment = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Comment.findOneAndDelete({ _id: id });
    res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteComment;
