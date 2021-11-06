const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

//importing the model
const Questions = require("../../models/Question.model");

const getQuestions = async (req, res, next) => {
  const { query } = req;
  try {
    const startIndex = (query.start && parseInt(query.start)) || 0;
    const viewSize = (query.limit && parseInt(query.limit)) || 10;
    const questionsList = await Questions.aggregate([
        { $skip: startIndex },
        { $limit: parseInt(viewSize) },
        { $sort: { created_at: -1 } },
      ]);
    const count = await Questions.countDocuments({
      type: req.query.type,
    });
    return res.status(200).json({
      message: "success",
      data: { questionsList, count },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getQuestions;
