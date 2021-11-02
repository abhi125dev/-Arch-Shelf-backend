const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import nodemailer function and verification template
// const sendEmail = require("../../config/nodemailer");
// const emailTemplate = require("../../config/emailTemplates/emailTemplate");

// import models and helpers
const User = require("../../models/User.model");
const ContactMech = require("../../models/ContactMech.model");
const UserLoginMech = require("../../models/UserLoginMech.model");
const Token = require("../../models/Token.model");
// const VerifyToken = require("../../models/VerifyToken.model");
const {
  generateAccessToken,
  generateRefreshToken,
  generateCryptoKey,
} = require("../../services/generate_token");
// const { registerValidation } = require("../../services/validation_schema");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const registerUser = async (req, res, next) => {
  try {
    // validation code here
    if (!req.body?.email && !req.body?.phone)
      throw createError.BadRequest(
        "Email or phone number is required for registration."
      );
    const result = req.body;

    const { email, phone, password, role, name, website, bio, gender } = result;

    // check for already registration of email
    if (email) {
      const existingEmail = await ContactMech.findOne({
        contact_mech_type: "email",
        contact_mech_value: email,
      });
      if (existingEmail) {
        throw createError.Conflict(
          `${email} is already registered. Please login.`
        );
      }
    }

    // check for already registration of phone
    if (phone) {
      const existingPhone = await ContactMech.findOne({
        contact_mech_type: "phone",
        contact_mech_value: phone,
      });
      if (existingPhone) {
        throw createError.Conflict(
          `${phone} is already registered. Please login.`
        );
      }
    }

    const createUserHandle = async () => {
      const userHandle =
        name?.replace(/\s/g, "").toLowerCase() +
        Math.random().toFixed(7) * 10000000;
      const existingUserHandle = await ContactMech.findOne({ userHandle });
      if (!existingUserHandle) createUserHandle();
      return userHandle;
    };

    const userHandle = await createUserHandle();

    const user = new User({
      name: req.body?.name,
      email: req.body?.email,
      website: req.body.website,
      // bio:,
      // gender,
      user_handle: userHandle,
    });

    // Save user to DB
    const createdUser = await user.save();
    if (!createdUser)
      throw createError.InternalServerError(
        "Your request could not be processed. Please contact support or try again after some time."
      );

    if (email) {
      const emailContactMech = new ContactMech({
        user: createdUser._id,
        contact_mech_type: "email",
        contact_mech_value: email,
      });

      const savedEmailContactMech = await emailContactMech.save();
      createdUser.primary_email = savedEmailContactMech._id;
    }

    if (phone) {
      const phoneContactMech = new ContactMech({
        user: createdUser._id,
        contact_mech_type: "phone",
        contact_mech_value: phone,
      });

      const savedPhoneContactMech = await phoneContactMech.save();
      createdUser.primary_phone = savedPhoneContactMech._id;
    }

    createdUser.save();

    // this runs when the user is new
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (email) {
      const userEmailLoginMech = new UserLoginMech({
        user: createdUser._id,
        login_mech_type: "email",
        login_mech_value: email,
        password: hashedPassword,
      });
      userEmailLoginMech.save();
    }

    if (phone) {
      const userPhoneLoginMech = new UserLoginMech({
        user: createdUser._id,
        login_mech_type: "phone",
        login_mech_value: phone,
        password: hashedPassword,
      });
      userPhoneLoginMech.save();
    }

    const userHandleLoginMech = new UserLoginMech({
      user: createdUser._id,
      login_mech_type: "user_handle",
      login_mech_value: userHandle,
      password: hashedPassword,
    });
    userHandleLoginMech.save();

    // generate verify email token and save to db
    // const verificationToken = generateCryptoKey();
    // const hashedToken = await bcrypt.hash(verificationToken, 10);
    // const verification = new VerifyToken({
    //   _userId: user.id,
    //   token: hashedToken,
    //   tokenType: "verification",
    // });
    // verification.save();

    // send verification email to saved user
    // const message = {
    //   subject: "Verification email",
    //   body: emailTemplate(user, verificationToken, "verifyEmail"),
    // };

    // sendEmail(user.email, message);

    // generate access and refresh token

    const jwtPayload = {
      data: {
        _id: createdUser._id,
        name: createdUser.name,
        phone: createdUser.primary_phone,
        email: createdUser.primary_email,
        website: createdUser.website,
        bio: createdUser.bio,
        gender: createdUser.gender,
        verified: createdUser.verified,
        userHandle: userHandle,
      },
      type: "user",
    };

    const accessToken = generateAccessToken(jwtPayload, accessTokenLife);
    const refreshToken = generateRefreshToken(jwtPayload, refreshTokenLife);
    if (accessToken && refreshToken) {
      const newToken = new Token({
        _userId: user._id,
        token: refreshToken,
      });
      // save refresh token to db
      const savedToken = await newToken.save();
      if (!savedToken)
        throw createError.InternalServerError(
          "Your request could not be processed. Please try again."
        );
      // send response
      res.cookie("auth", refreshToken, { httpOnly: true });
      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        user: jwtPayload.data,
      });
    }
  } catch (error) {
    console.log("error register: ", error);
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = registerUser;
