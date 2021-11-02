const { Schema, model } = require("mongoose");
// create a schema
const testimonialsSchema = new Schema(
  {
    name: { type: String, required: true },
    reviews: { type: String, required: true },
    media: {
      url: { type: String },
      type: { type: String },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Testimonials = model("Testimonials", testimonialsSchema, "testimonial");

// make this available to our users in our Node applications
module.exports = Testimonials;
