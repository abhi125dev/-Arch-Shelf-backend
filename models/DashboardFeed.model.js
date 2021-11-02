const { Schema, model } = require("mongoose");
// create a schema
const DashboardFeedsSchema = new Schema(
  {
    feed: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
      unique: true,
    },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
// the schema is useless so far
// we need to create a model using it
const DashboardFeeds = model(
  "DashboardFeeds",
  DashboardFeedsSchema,
  "dashboardFeeds"
);

// make this available to our users in our Node applications
module.exports = DashboardFeeds;
