const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;
// import post model
const Transaction = require("../../models/Transaction.model");
const Post = require("../../models/Post.model");

const purchasePost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      throw createError.BadRequest();
    }
    const transactionRecord = await Transaction.findOne({
      token: req.body.clientId,
      user: ObjectId(userId),
    });
    if (!transactionRecord) {
      throw createError.PaymentRequired();
    }
    await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { premium_group: ObjectId(userId) } },
      { new: true }
    );
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = purchasePost;
