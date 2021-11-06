const router = require("express").Router();

// import routes and middlewares
const authRoutes = require("./Auth.route");
const postRoutes = require("./Post.route");
const meRoutes = require("./Me.route");
const stripeRoutes = require("./Stripe.route");
const userRoutes = require("./User.route");
const feedRoutes = require("./Feed.route");
const categoryRoutes = require("./Category.route");
const testimonialRoutes = require("./Testimonial.route");
const DashboardFeedsRoutes = require("./DashboardFeed.route");
const competitionsRoutes = require("./Competition.route");
const questionsRoutes = require("./Question.route");
const validateAccessToken = require("../../middlewares/jwt_validation");

router.use("/auth", authRoutes);
// router.use("/post", validateAccessToken, postRoutes);
router.use("/me", validateAccessToken, meRoutes);
router.use("/stripe", validateAccessToken, stripeRoutes);
router.use("/user", userRoutes);
router.use("/feeds", feedRoutes);
router.use("/category", categoryRoutes);
router.use("/testimonials", validateAccessToken, testimonialRoutes);
router.use("/dashboardFeeds", DashboardFeedsRoutes);
router.use("/competitions", competitionsRoutes);
router.use("/question", questionsRoutes);

// test route
router.get("/test", (req, res, next) => {
  res.status(200).json({
    message: "success",
  });
});

router.get("/ping", (req, res) => {
  res.json({ success: "true", message: "successfull request" });
});

module.exports = router;