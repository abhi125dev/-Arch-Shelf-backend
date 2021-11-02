const createError = require("http-errors");
// import post model
const Feed = require("../../models/Feed.model");
const convertParams = require("../../helpers/convertParams");

const deleteFeedImage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Feed.findOneAndUpdate({ _id: id }, { media: null });
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteFeedImage;
