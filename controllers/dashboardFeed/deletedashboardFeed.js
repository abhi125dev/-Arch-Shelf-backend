const createError = require("http-errors");

//importing the model
const DashboardFeed = require("../../models/DashboardFeed.model");

const deleteDashboardFeed = async (req, res, next) => {
  try {
    DashboardFeed.findOneAndDelete({ feed: req.params.id })
      .then((feed) => {
        return res.status(200).json({
          message: "success",
          data:
            "Feed with id " + req.params.id + " has been successfully deleted",
        });
      })
      .catch((err) => {
        console.log("error: ", err.message);
        next(err);
      });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = deleteDashboardFeed;
