const { Schema, model } = require("mongoose");
// create a schema
const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    media: [
      {
        url: { type: String },
        type: { type: String },
        name: { type: String },
      },
    ],
    shortDescription: { type: String },
    architects: { type: String },
    manufacturers: { type: String },
    country: { type: String },
    area: { type: String },
    clients: { type: String },
    leadArchitects: { type: String },
    photographs: { type: String },
    // url: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    body: { type: String, required: true },
    year: { type: Number },
    type: {
      type: String,
      required: true,
      //to add the types as got from the requirements
      enum: [
        "resources",
        "products",
        "projects",
        "courses",
        "competitions",
        "breakfasts",
      ],
      default: "projects",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Project = model("Project", projectSchema, "project");

// make this available to our users in our Node applications
module.exports = Project;
