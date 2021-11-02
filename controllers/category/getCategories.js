const createError = require("http-errors");
const Category = require("../../models/Category.model");
const convertParams = require("../../helpers/convertParams");

//importing the model

const getCategories = async (req, res, next) => {
  const filters = await convertParams(Category, req.query);

  Category.find(filters.find)
    .populate("updatedBy")
    .populate("createdBy")
    .where(filters.where)
    .sort({ created_at: "desc" })
    .skip(filters.start)
    .limit(filters.limit)
    .exec(function (err, categories) {
      if (err) {
        res.status(400);
        res.send(err);
      }
      Category.countDocuments(
        { ...filters.where, ...filters.find },
        (err, count) => {
          if (err) {
            res.status(400);
            res.send({ message: "Parameters are not valid" });
          }
          const categoryList = {
            categories: categories,
            categoryCount: categories.length,
            total: count,
          };
          res.status(200).send(categoryList);
        }
      );
    });
};

module.exports = getCategories;
