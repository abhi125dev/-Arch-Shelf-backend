const router = require("express").Router();

// bring in models and controllers
const generatePayment = require("../../controllers/stripe/generatePayment");
const confirmPayment = require("../../controllers/stripe/confirmPayment");

//generate payment request for a card payer
router.post("/generate", generatePayment);

//generate payment request for a card payer
router.post("/confirm", confirmPayment);

module.exports = router;
