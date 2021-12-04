const { Schema, model } = require("mongoose");
// create a schema
const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryType: {
      type: String,
      required: false,
      enum: [
        "resources",
        "products",
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
const Category = model("Category", categorySchema, "category");

// make this available to our users in our Node applications
module.exports = Category;
