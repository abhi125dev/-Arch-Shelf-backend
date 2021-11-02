const router = require("express").Router();

const addTestimonial = require("../../controllers/testimonials/addTestimonial");
const deleteTestimonial = require("../../controllers/testimonials/deleteTestimonial");
const deleteTestimonialImage = require("../../controllers/testimonials/deleteTestimonialImage");
const getTestimonial = require("../../controllers/testimonials/getTestimonial");
const getTestimonials = require("../../controllers/testimonials/getTestimonials");
const updateTestimonial = require("../../controllers/testimonials/updateTestimonial");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.post("/add", validateAccessToken, addTestimonial);
router.get("/", validateAccessToken, getTestimonial);
router.put("/:id", validateAccessToken, updateTestimonial);
router.delete("/:id", validateAccessToken, deleteTestimonial);
router.get("/:id", validateAccessToken, getTestimonials);
router.put("/image/:id", validateAccessToken, deleteTestimonialImage);

module.exports = router;
