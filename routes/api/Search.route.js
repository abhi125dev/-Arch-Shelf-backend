const router = require("express").Router();

// bring in models and controllers
const search = require("../../controllers/search/search");

// Get all feeds
router.get("/", search);

module.exports = router;
