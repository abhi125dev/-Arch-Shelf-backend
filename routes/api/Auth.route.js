const router = require("express").Router();
const passport = require("passport");

// bring in controllers
const registerUser = require("../../controllers/auth/register");
const loginUser = require("../../controllers/auth/login");
const refresh = require("../../controllers/auth/refresh");
const logoutUser = require("../../controllers/auth/logout");
// const verifyEmail = require("../../controllers/user/verify");
// const requestResetPassword = require("../../controllers/user/requestResetPassword");
// const resetForgotPassword = require("../../controllers/user/resetForgotPassword");
// const oAuthLogin = require("../../controllers/user/oauth");
// const oAuthVerify = require("../../controllers/user/oauthverify");

// bring in middlewares
const validateAccessToken = require("../../middlewares/jwt_validation");

// login user
router.post("/login", loginUser);

// logout user
router.delete("/logout", logoutUser);

// register a user
router.post("/register", registerUser);

// generate new access-token using refresh-token
router.post("/refresh-token", refresh);

// verify email
// router.get("/verify/:userid/:token", verifyEmail);

// request reset password
// router.post("/requestResetPassword", requestResetPassword);

// reset password
// router.post("/resetPassword", resetForgotPassword);

// /api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })
);

// /api/auth/google/callback
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   oAuthLogin
// );

// /api/auth/verify-oauth
// router.post("/verify-oauth", oAuthVerify);

module.exports = router;
