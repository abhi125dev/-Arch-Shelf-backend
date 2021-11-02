const { Schema, model } = require("mongoose");
// create a schema
const feedSchema = new Schema(
  {
    title: { type: String, required: true },
    media: {
      url: { type: String },
      type: { type: String },
    },
    shortDescription: { type: String },
    url: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    body: { type: String, required: true },
    type: {
      type: String,
      required: true,
      //to add the types as got from the requirements
      enum: [
        "resources",
        "projects",
        "courses",
        "initiatives",
        "competitions",
        "breakfasts",
      ],
      default: "resources",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Feed = model("Feed", feedSchema, "feed");

// make this available to our users in our Node applications
module.exports = Feed;
