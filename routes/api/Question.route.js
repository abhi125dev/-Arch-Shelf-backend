const router = require("express").Router();

// bring in models and controllers

const addQuestion = require("../../controllers/question/addQuestion");
const getQuestions = require("../../controllers/question/getQuestions");

router.post("/", addQuestion);

router.get("/", getQuestions);


module.exports = router;
