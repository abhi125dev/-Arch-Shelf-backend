// const bcrypt = require("bcryptjs");
// const createError = require("http-errors");

// // import verify token model and user model
// const VerifyToken = require("../../models/VerifyToken.model");
// const User = require("../../models/User.model");

// const verifyEmail = async (req, res, next) => {
//   try {
//     const { userid, token } = req.params;
//     if (!userid || !token) throw createError.BadRequest();
//     const tokenDetails = await VerifyToken.findOne({
//       _userId: userid,
//       tokenType: "verification",
//     });
//     if (!tokenDetails)
//       throw createError.BadRequest(
//         "Your verification link may have expired. Please send another verification email"
//       );
//     const user = await User.findOne({ _id: userid });
//     if (!user)
//       throw createError.BadRequest(
//         "We were unable to find a user for this verification. Please SignUp!"
//       );
//     if (user.verified)
//       throw createError.Conflict(
//         "User has been already verified. Please Login"
//       );

//     const isMatch = await bcrypt.compare(token, tokenDetails.token);
//     if (!isMatch) throw createError();
//     user.verified = true;
//     const updatedUser = await user.save();
//     if (!updatedUser)
//       throw createError.InternalServerError(
//         "User could not be verified. Please try again."
//       );
//     res.status(200).json({
//       success: true,
//       message: "Your account has been successfully verified",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = verifyEmail;
