const { ObjectId } = require("mongoose").Types;
const createError = require("http-errors");

//importing the model
const Competition = require("../../models/Competitions.model");

const getCompetition = async (req, res, next) => {
  try {
    const competition = await Competition.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
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
          user: 1,
          body: 1,
          created_at: 1,
          updated_at: 1,
          startDay: 1,
          submissionDate: 1,
          organizer: 1,
          price: 1,
          status: 1,
          user: {
            _id: 1,
            name: 1,
            user_handle: 1,
            avatar_url: 1,
          },
        },
      },
    ]);
    return res.status(200).json({
      message: "success",
      data: competition[0],
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = getCompetition;
