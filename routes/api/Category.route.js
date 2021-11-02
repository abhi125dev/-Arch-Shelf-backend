const router = require("express").Router();

const addCategory = require("../../controllers/category/addCategory");
const deleteCategory = require("../../controllers/category/deleteCategory");
const getCategories = require("../../controllers/category/getCategories");
const getCategory = require("../../controllers/category/getCategory");
const updateCategory = require("../../controllers/category/updateCategory");

const validateAccessToken = require("../../middlewares/jwt_validation");

// Get all category
router.get("/list", getCategories);

// get a particular category by id
router.get("/:id", validateAccessToken, getCategory);

// create a new category
router.post("/create", validateAccessToken, addCategory);

// delete a new category
router.delete("/:id", validateAccessToken, deleteCategory);

// update a new category
router.put("/:id", validateAccessToken, updateCategory);

module.exports = router;
