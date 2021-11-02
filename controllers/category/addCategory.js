const Category = require("../../models/Category.model");
const _ = require("lodash");

const addCategory = async (req, res, next) => {
  const { body, user } = req;

  body.createdBy = user.data._id;
  body.updatedBy = user.data._id;
  Category.create(body, function (err, category) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    res.send(category);
  });
};

module.exports = addCategory;
