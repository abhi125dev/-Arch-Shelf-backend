const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { refreshSecret, accessTokenLife, refreshTokenLife } =
  require("../../config/keys").jwt;

const refreshTokens = async (req, res, next) => {
  try {
    // check if refresh token is passed in request header
    if (!req.headers["refreshtoken"])
      throw createError.Unauthorized("Refresh Token is not passed");

    const token = req.headers["refreshtoken"];

    const payload = jwt.verify(token, refreshSecret);
    if (!payload)
      throw createError.Unauthorized("Session expired. Please login again.");

    const resultQuery = await Token.findOne({ _userId: payload._id, token });
    if (!resultQuery) throw createError.Unauthorized("Please login again");
    if (resultQuery.token !== token) throw createError.Unauthorized();

    const accessToken = generateAccessToken(payload, accessTokenLife);
    const refreshToken = generateRefreshToken(payload, refreshTokenLife);
    if (accessToken && refreshToken) {
      resultQuery.overwrite(
        new Token({
          _userId: payload._id,
          token: refreshToken,
        })
      );
      await resultQuery.save();
      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
    }
  } catch (err) {
    const message =
      err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
    next(createError.Unauthorized(message));
  }
};

module.exports = refreshTokens;
