const createError = require("http-errors");
const Category = require("../../models/Category.model");
const convertParams = require("../../helpers/convertParams");

const getCategory = async (req, res, next) => {
  const { params } = req;
  Category.findOne({ _id: params.id }).exec(function (err, category) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.send(category);
  });
};

module.exports = getCategory;
