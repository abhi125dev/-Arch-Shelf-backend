const router = require("express").Router();

// bring in models and controllers
const createCompetition = require("../../controllers/competition/addCompetition");
const getCompetitions = require("../../controllers/competition/getCompetitions");
const getCompetition = require("../../controllers/competition/getCompetition");
const updateCompetition = require("../../controllers/competition/updateCompetition");
const deleteCompetition = require("../../controllers/competition/deleteCompetition");
// const deleteFeedImage = require("../../controllers/feed/deleteFeedImage");
const validateAccessToken = require("../../middlewares/jwt_validation");

// Get all feeds
router.get("/", getCompetitions);

// // get a particular feed by id ,
router.get("/:id", getCompetition);

// // update feed
router.put("/:id", validateAccessToken, updateCompetition);

// // delete a feed
router.delete("/:id", validateAccessToken, deleteCompetition);

// create a new feed
router.post("/", validateAccessToken, createCompetition);

// router.put("/image/:id", deleteFeedImage);

module.exports = router;
