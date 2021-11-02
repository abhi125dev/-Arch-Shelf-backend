const Testimonials = require("../../models/Testimonials.model");

const getTestimonials = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Testimonials.find({ _id: id });
    if (data) {
      res.status(200).send(data);
    }
  } catch (err) {
    console.log(`err`, err);
  }
};

module.exports = getTestimonials;
