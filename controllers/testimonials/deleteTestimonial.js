const createError = require("http-errors");

//importing the model
const Testimonials = require("../../models/Testimonials.model");

const deleteTestimonial = async (req, res, next) => {
  try {
    Testimonials.findByIdAndDelete(req.params.id)
      .then((testimonials) => {
        return res.status(200).json({
          message: "success",
          data:
            "Testimonial with id " +
            req.params.id +
            " has been successfully deleted",
        });
      })
      .catch((err) => {
        console.log("error: ", err.message);
        next(err);
      });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = deleteTestimonial;
