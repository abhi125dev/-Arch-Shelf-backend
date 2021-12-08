const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

//importing the model
const Competition = require("../../models/Competitions.model");

const getCompetitions = async (req, res, next) => {
  const { query } = req;
  try {
    const startIndex = (query.start && parseInt(query.start)) || 0;
    const viewSize = (query.limit && parseInt(query.limit)) || 10;
    let filters;
    if (query.selected) {
      filters = {
        type: req.query.type,
        category: ObjectId(query.selected),
      };
    } else {
      filters = {
        type: req.query.type,
      };
    }
    if (query.keywordState) {
      filters.title = {
        $regex: `${query.keywordState}`,
        $options: "i",
      };
    }
    if (query.date) {
      filters = {
        startDay: {
          $lte: new Date(query.date),
        },
      };
    }
    const competitionsList = await Competition.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "user",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          media: 1,
          url: 1,
          user: 1,
          body: 1,
          startDay: 1,
          submissionDate: 1,
          organizer: 1,
          price: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          user: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
        },
      },
      { $sort: { created_at: -1 } },
      { $skip: startIndex },
      { $limit: parseInt(viewSize) },
    ]);
    const count = await Competition.countDocuments({
      type: req.query.type,
    });
    return res.status(200).json({
      message: "success",
      data: { competitionsList, count },
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getCompetitions;
