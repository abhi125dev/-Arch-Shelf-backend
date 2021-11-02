const { Schema, model } = require("mongoose");
// create a schema
const postSchema = new Schema(
  {
    name: { type: String, required: true },
    media: [
      {
        url: { type: String },
        type: { type: String },
      },
    ],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number },
    type: {
      type: String,
      required: true,
      enum: ["open", "subscription", "premium"],
      default: "open",
    },
    average_rating: { type: Number },
    premium_group: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Post = model("Post", postSchema, "post");

// make this available to our users in our Node applications
module.exports = Post;
