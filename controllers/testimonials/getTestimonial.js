const createError = require("http-errors");
const formidable = require("formidable");

const Testimonials = require("../../models/Testimonials.model");

const getTestimonial = async (req, res, next) => {
  try {
    const data = await Testimonials.find();
    if (data) {
      return res.status(200).send(data);
    }
  } catch (error) {
    console.log("error : ", error);
  }
};

module.exports = getTestimonial;
