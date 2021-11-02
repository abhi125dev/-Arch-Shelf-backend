const createError = require("http-errors");

// import user model
const User = require("../../models/User.model");

const getUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const response = await User.findOne({ _id: userId })
      .populate("primary_email")
      .populate("primary_phone");
    if (!response)
      throw createError.InternalServerError("User details can not be fetched");

    const userDetails = {
      _id: response._id,
      name: response.name,
      phone: response.primary_phone?.contact_mech_value,
      email: response.primary_email?.contact_mech_value,
      user_handle: response.user_handle,
      website: response.website,
      bio: response.bio,
      gender: response.gender,
      verified: response.verified,
      avatar_url: response?.avatar_url,
      cover_url: response?.cover_url,
    };

    res.status(200).json({
      message: "success",
      data: userDetails,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getUser;
