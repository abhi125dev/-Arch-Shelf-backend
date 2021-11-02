const router = require("express").Router();

// bring in models and controllers
const addDashboardFeed = require("../../controllers/dashboardFeed/adddashboardFeed");
const getDashboardFeeds = require("../../controllers/dashboardFeed/getdashboardFeeds");
const deleteDashboardFeed = require("../../controllers/dashboardFeed/deletedashboardFeed");
const validateAccessToken = require("../../middlewares/jwt_validation");

// // Get all feeds
router.get("/", getDashboardFeeds);

// // delete a feed
router.delete("/:id", validateAccessToken, deleteDashboardFeed);

// // create a new feed
router.post("/", validateAccessToken, addDashboardFeed);

module.exports = router;
