const createError = require("http-errors");
const formidable = require("formidable");

//importing the model
const Feed = require("../../models/Feed.model");
const uploadFiles = require("../../services/upload-files");

const updateFeed = async (req, res, next) => {
  try {
    const { id: id } = req.params;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.send(err);
      }
      const filesArray = Object.values(files);
      console.log("files: ", filesArray);
      const allFileUploadedArray = await Promise.all(
        filesArray?.map(async (item) => {
          let location = item.path;
          const originalFileName = item.name;
          const fileType = item.type;
          // uploads file.
          const data = await uploadFiles.upload(
            location,
            originalFileName,
            `${id}/feeds`
          );
          return {
            url: data.Location,
            type: fileType,
          };
        })
      );
      if (!allFileUploadedArray)
        throw createError.InternalServerError(
          "Your request could not be processed. Please contact support or try again after some time."
        );
      let updateQuery = {
        title: fields.title,
        body: fields.body,
        type: fields.type,
        shortDescription: fields.shortDescription,
        category: fields.category,
        url: fields.url,
      };
      if (allFileUploadedArray[0]) updateQuery.media = allFileUploadedArray[0];
      const response = await Feed.findOneAndUpdate({ _id: id }, updateQuery, {
        new: true,
      });
      res.status(200).json({
        message: "success",
        data: response,
      });
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = updateFeed;
