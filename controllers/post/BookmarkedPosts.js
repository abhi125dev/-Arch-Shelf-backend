const createError = require("http-errors");
// import post model
const Bookmark = require("../../models/Bookmark.model");
const Post = require("../../models/Post.model");

const getBookMarkedPosts = async (req, res, next) => {
  const { _id: userId } = req.user.data;
  try {
    if (!req.query._start) {
      throw createError.BadRequest();
    }
    const bookmark = await Bookmark.find({
      user: userId,
    })
      .skip(Number(req.query?._start))
      .limit(Number(req.query?._limit))
      .populate({
        path: "post",
        populate: {
          path: "user",
        },
      });
    const data = bookmark.map((item) => item.post);
    const count = await Bookmark.countDocuments({
      user: userId,
    });
    res.json({
      message: "success",
      data: { posts: data, count: data.length, totalCount: count },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBookMarkedPosts;
