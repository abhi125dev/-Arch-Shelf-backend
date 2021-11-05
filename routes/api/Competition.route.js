const router = require("express").Router();

// bring in models and controllers
const createCompetition = require("../../controllers/competition/addCompetition");
const getCompetitions = require("../../controllers/competition/getCompetitions");
// const getFeeds = require("../../controllers/feed/getFeeds");
// const getFeed = require("../../controllers/feed/getFeed");
// const updateFeed = require("../../controllers/feed/updateFeed");
// const deleteFeed = require("../../controllers/feed/deleteFeed");
// const addComment = require("../../controllers/comment/addComment");
// const getComments = require("../../controllers/comment/getComments");
// const deleteComment = require("../../controllers/comment/deleteComment");
// const deleteFeedImage = require("../../controllers/feed/deleteFeedImage");
const validateAccessToken = require("../../middlewares/jwt_validation");

// Get all feeds
router.get("/", getCompetitions);

// // get a particular feed by id ,
// router.get("/:id", getFeed);

// // update feed
// router.put("/:id", updateFeed);

// // delete a feed
// router.delete("/:id", deleteFeed);

// create a new feed
router.post("/", validateAccessToken, createCompetition);

// // create a new comment for feed
// router.post("/:id/comment", addComment);

// //get comment for feed
// router.get("/:id/comment", getComments);

// //get comment for feed
// router.delete("/:id/comment", deleteComment);

// router.put("/image/:id", deleteFeedImage);

module.exports = router;
