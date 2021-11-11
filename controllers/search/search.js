const createError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

//importing the model
//importing the model
const Feed = require("../../models/Feed.model");
const Competition = require("../../models/Competitions.model");

function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj;
}
const Search = async (req, res, next) => {
  const { query } = req;
  // console.log(!(Object.keys(query).length === 0 && query.constructor === Object));
  if (!(Object.keys(query).length === 0 && query.constructor === Object)) {
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
      clean(filters);
      // console.log(filters, "FIL");
      const feedList = await Feed.aggregate([
        { $match: filters },
        {
          $lookup: {
            from: "category",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
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
            shortDescription: 1,
            url: 1,
            user: 1,
            category: 1,
            body: 1,
            type: 1,
            created_at: 1,
            updated_at: 1,
            category: {
              _id: 1,
              name: 1,
            },
            user: {
              _id: 1,
              name: 1,
              user_handle: 1,
              avatar_url: 1,
            },
          },
        },
        { $sort: { created_at: -1 } },
      ]);
      const competitionList = await Competition.aggregate([
        { $match: filters },
        {
          $lookup: {
            from: "category",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
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
            shortDescription: 1,
            url: 1,
            user: 1,
            category: 1,
            body: 1,
            type: 1,
            created_at: 1,
            updated_at: 1,
            category: {
              _id: 1,
              name: 1,
            },
            user: {
              _id: 1,
              name: 1,
              user_handle: 1,
              avatar_url: 1,
            },
          },
        },
        { $sort: { created_at: -1 } },
      ]);
      // console.log(feedList,'FEED',competitionList,'COMP')
      const count = await Feed.countDocuments(filters);
      const count2 = await Competition.countDocuments(filters);
      // console.log(feedList, "FEED", competitionList, "COMP");
      return res.status(200).json({
        message: "success",
        data: {
          resultList: feedList.concat(competitionList),
          count: count + count2,
        },
      });
    } catch (error) {
      next(error);
    }
  } else {
    return res.json({
      message: "Missing query",
    });
  }
};

module.exports = Search;
