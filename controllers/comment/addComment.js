const createError = require("http-errors");
// import post model
const Comment = require("../../models/Comment.model");
const convertParams = require("../../helpers/convertParams");
const Feed = require("../../models/Feed.model");

const postComment = async (req, res, next) => {
  const feedId = req.params.id;
  try {
    const feed = await Feed.findOne({ _id: feedId });
    if (feed.type !== "blog") {
      throw createError.BadRequest(
        `Not allowed because feed type is ${feed.type}`
      );
    }
    const comment = new Comment({
      feed_id: feedId,
      user: req.body.user,
      comment: req.body.comment,
    });
    comment.save();
    res.json({ message: "success", data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = postComment;
