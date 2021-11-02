var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// create a schema
var PostRatingSchema = new Schema(
  {
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
var PostRating = mongoose.model("PostRating", PostRatingSchema, "postrating");

// make this available to our users in our Node applications
module.exports = PostRating;
