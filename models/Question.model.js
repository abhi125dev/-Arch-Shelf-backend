const { Schema, model } = require("mongoose");
// create a schema
const QuestionsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true  },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const Questions = model(
  "Questions",
  QuestionsSchema,
  "questions"
);

// make this available to our users in our Node applications
module.exports = Questions;
