const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    primary_phone: { type: Schema.Types.ObjectId, ref: "ContactMech" },
    primary_email: { type: Schema.Types.ObjectId, ref: "ContactMech" },
    user_handle: { type: String, required: true },
    avatar_url: { type: String },
    cover_url: { type: String },
    website: { type: String },
    bio: { type: String },
    gender: {
      type: String,
      trim: true,
      valueType: "String",
    },
    is_verified: { type: Boolean, default: false, required: true },
    is_private: { type: Boolean, default: false, required: true },
    posts: { type: Array },
    followers: { type: Array },
    following: { type: Array },
    subscribers: { type: Array },
    subscription_price: { type: Number },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = model("User", userSchema, "user");

// make this available to our users in our Node applications
module.exports = User;
