const createError = require("http-errors");

// import user model
const User = require("../../models/User.model");

const getUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const user_handle = req.params.id;
    const response = await User.findOne(
      { user_handle },
      {
        _id: 1,
        name: 1,
        user_handle: 1,
        bio: 1,
        gender: 1,
        is_verified: 1,
        avatar_url: 1,
        cover_url: 1,
        website: 1,
      }
    );
    if (!response)
      throw createError.InternalServerError("User details can not be fetched");

    res.status(200).json({
      message: "success",
      data: response,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getUser;
