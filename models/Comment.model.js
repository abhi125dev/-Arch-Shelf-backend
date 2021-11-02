var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// create a schema
var CommentSchema = new Schema(
  {
    feed_id: { type: Schema.Types.ObjectId, ref: "Feed", required: true },
    comment: { type: String, required: true },
    user: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Comment = mongoose.model("Comment", CommentSchema, "comment");

// make this available to our users in our Node applications
module.exports = Comment;
