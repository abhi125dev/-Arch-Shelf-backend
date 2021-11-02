const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/User.model");
const UserLoginMech = require("../../models/UserLoginMech.model");
const Token = require("../../models/Token.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { loginValidation } = require("../../services/validation_schema");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const loginUser = async (req, res, next) => {
  try {
    // validation check of credentials
    // const result = await loginValidation.validateAsync(req.body);
    const { email, password } = req.body;

    // Check if email is registered
    const userLogin = await UserLoginMech.findOne({
      login_mech_value: email,
    })
      .populate({
        path: "user",
        populate: {
          path: "primary_email",
        },
      })
      .populate({
        path: "user",
        populate: {
          path: "primary_phone",
        },
      });

    // email does not exist
    if (!userLogin) {
      throw createError.BadRequest(
        "This user is not registered. Please Sign Up."
      );
    }

    // if (user.provider != "email")
    //   throw createError.BadRequest(
    //     `This email is already registered with ${user.provider}. Please login in with ${user.provider}.`
    //   );

    // Compare password with saved password
    const isMatch = await bcrypt.compare(password, userLogin.password);
    if (!isMatch) {
      throw createError.Unauthorized("Incorrect password");
    }

    const payload = {
      data: {
        _id: userLogin.user._id,
        name: userLogin.user.name,
        userHandle: userLogin.user.user_handle,
        email: userLogin.user.primary_email?.contact_mech_value,
        phone: userLogin.user.primary_phone?.contact_mech_value,
        website: userLogin.user.website,
        bio: userLogin.user.bio,
        gender: userLogin.user.gender,
        verified: userLogin.user.verified,
      },
      type: "user",
    };

    //Generate new access and refresh tokens
    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);

    if (accessToken && refreshToken) {
      const token = new Token({
        _userId: userLogin.user._id,
        token: refreshToken,
      });
      token.save();

      res.cookie("auth", refreshToken, { httpOnly: true });

      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: payload.data,
      });
    }
  } catch (error) {
    console.log("error: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = loginUser;
