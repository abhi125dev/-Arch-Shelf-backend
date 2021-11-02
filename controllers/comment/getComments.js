const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

//importing the model
const Comment = require("../../models/Comment.model");

const getComments = async (req, res, next) => {
  try {
    const { query } = req;
    const startIndex = (query.start && parseInt(query.start)) || 0;
    const viewSize = (query.limit && parseInt(query.limit)) || 5;
    const comments = await Comment.aggregate([
      { $match: { feed_id: ObjectId(req.params.id) } },
      { $sort: { created_at: -1 } },
      { $skip: startIndex },
      { $limit: parseInt(viewSize) },
    ]);
    const count = await Comment.countDocuments({ feed_id: req.params.id });
    return res.status(200).json({
      message: "success",
      data: { comments, count },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getComments;
