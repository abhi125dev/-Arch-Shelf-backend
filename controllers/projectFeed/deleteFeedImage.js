const createError = require("http-errors");
// import post model
const Feed = require("../../models/Feed.model");
const Project = require("../../models/Project.model");
const convertParams = require("../../helpers/convertParams");

const deleteFeedImage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Project.findOneAndUpdate(
      { _id: id },
      { $pull: { media: { url: req.body.url } } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteFeedImage;
