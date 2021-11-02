const createError = require("http-errors");
// import post model
const Bookmark = require("../../models/Bookmark.model");
const Post = require("../../models/Post.model");

const addBookmark = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      throw createError.BadRequest();
    }
    const existingBookmark = await Bookmark.findOne({
      post: req.params.id,
      user: userId,
    });
    if (existingBookmark) {
      throw createError.BadRequest();
    }
    const bookmark = new Bookmark({
      post: req.params.id,
      user: userId,
    });
    bookmark.save();
    res.json({ message: "success", data: bookmark });
  } catch (error) {
    next(error);
  }
};

module.exports = addBookmark;
