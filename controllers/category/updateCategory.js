const createError = require("http-errors");
const Category = require("../../models/Category.model");
const convertParams = require("../../helpers/convertParams");

const updateCategory = async (req, res, next) => {
  const { body, user, params } = req;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: params.id },
      {
        name: body.name,
        categoryType: body.categoryType,
        updatedBy: user.data._id,
      }
    );
    return res.status(200).send(category);
  } catch (error) {
    console.log("error: ", error);
  }
};

module.exports = updateCategory;
