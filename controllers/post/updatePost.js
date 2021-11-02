const createError = require("http-errors");

// import post model
const Post = require("../../models/Post.model");
const convertParams = require("../../helpers/convertParams");

const updatePost = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      throw createError.InternalServerError();
    }
    post.name = req.body.name;
    post.save();
    res.json({ message: "success", data: post });
  } catch (error) {
    next(error);
  }
};

module.exports = updatePost;
