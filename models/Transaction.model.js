const { Schema, model } = require("mongoose");

const { refreshTokenLife } = require("../config/keys");

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Token = model("transaction", transactionSchema, "transaction");

module.exports = Token;
