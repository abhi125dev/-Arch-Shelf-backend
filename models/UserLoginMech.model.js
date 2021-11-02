const { Schema, model } = require("mongoose");

const userLoginMechSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    login_mech_type: {
      type: String,
      valueType: "String",
      trim: true,
    },
    login_mech_value: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const UserLoginMech = model(
  "UserLoginMech",
  userLoginMechSchema,
  "userloginmech"
);

// make this available to our users in our Node applications
module.exports = UserLoginMech;
