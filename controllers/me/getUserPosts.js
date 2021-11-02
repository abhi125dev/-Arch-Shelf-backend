const createError = require("http-errors");

// import user model
const Post = require("../../models/Post.model");

const getUserPosts = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const response = await Post.find({ user: userId }).populate({
      path: "user",
      populate: {
        path: "userContactMech",
      },
    });
    if (!response)
      throw createError.InternalServerError("User posts can not be fetched");

    const posts = response.map((item) => ({
      _id: item._id,
      name: item.name,
      media: item.media,
      created_at: item.created_at,
      updated_at: item.updated_at,
      user: {
        _id: item.user._id,
        user_handle: item.user.user_handle,
        name: item.user.name,
        avatar_url: item.user.avatar_url,
      },
    }));
    res.status(200).json({
      message: "success",
      data: posts,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getUserPosts;
