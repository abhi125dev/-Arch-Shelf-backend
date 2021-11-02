const createError = require("http-errors");
// import post model
const Testimonials = require("../../models/Testimonials.model");
const convertParams = require("../../helpers/convertParams");

const deleteTestimonialImage = async (req, res, next) => {
  const { id } = req.params;
  try {
    const data = await Testimonials.findOneAndUpdate(
      { _id: id },
      { media: null }
    );
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteTestimonialImage;
