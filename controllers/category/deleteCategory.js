const createError = require("http-errors");
const Category = require("../../models/Category.model");
const convertParams = require("../../helpers/convertParams");
const Feed = require("../../models/Feed.model");

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const findFeed = await Feed.exists({ category: id });
    if (findFeed) throw createError.Conflict(`Category is already in use`);
    await Category.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCategory;
