var { Schema, model } = require("mongoose");
// create a schema
var roleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
var Role = model("Role", roleSchema);

// make this available to our users in our Node applications
module.exports = Role;
