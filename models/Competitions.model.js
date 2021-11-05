const { Schema, model } = require("mongoose");
// create a schema
const competitionsSchema = new Schema(
  {
    title: { type: String, required: true },
    media: [{
      url: { type: String },
      type: { type: String },
    }],
    startDay: { type: Date, required: true },
    submissionDate: { type: Date, required: true },
    organizer: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // category: { type: Schema.Types.ObjectId, ref: "Category" },
    body: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Competition = model("Competition", competitionsSchema, "competition");

// make this available to our users in our Node applications
module.exports = Competition;
