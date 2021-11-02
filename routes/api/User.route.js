const router = require("express").Router();

// bring in models and controllers
const validateAccessToken = require("../../middlewares/jwt_validation");
const getUser = require("../../controllers/user/getUser");
const getUserPosts = require("../../controllers/user/getUserPosts");
const subscribeToUser = require("../../controllers/subscription/new");

// get user details
router.get("/:id", validateAccessToken, getUser);

// get user posts
router.get("/:id/posts", validateAccessToken, getUserPosts);

// subscribe to user
router.post("/:id/subscribe", validateAccessToken, subscribeToUser);

module.exports = router;
