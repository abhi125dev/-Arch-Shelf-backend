const router = require("express").Router();

// bring in models and controllers
const getUser = require("../../controllers/me/getUser");
const updateUser = require("../../controllers/me/updateUser");
const getUserPosts = require("../../controllers/me/getUserPosts");
const updateAvatar = require("../../controllers/me/updateAvatar");
const uploadCover = require("../../controllers/me/uploadCover");
const deleteAvatar = require("../../controllers/me/deleteAvatar");
const deleteCover = require("../../controllers/me/deleteCover");
const handleExists = require("../../controllers/me/handleExists");

// get user details
router.get("/", getUser);

// update user details
router.put("/", updateUser);

// register a user
router.get("/posts", getUserPosts);

// post profile picture
router.post("/avatar", updateAvatar);

// post profile picture
router.post("/cover", uploadCover);

// post profile picture
router.delete("/avatar", deleteAvatar);

// post profile picture
router.delete("/cover", deleteCover);

// update user details
router.post("/exists", handleExists);

module.exports = router;
