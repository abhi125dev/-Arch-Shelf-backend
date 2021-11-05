const createError = require("http-errors");
const formidable = require("formidable");
const fs = require("fs");

// import verify token model and user model
const uploadFiles = require("../../services/upload-files");
const Competition = require("../../models/Competitions.model");

const { feedValidation } = require("../../services/validation_schema");

const createCompetition = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw createError.BadRequest(err);
      }

      try {
        const result = await feedValidation.validateAsync(fields);
        const { title, body, startDay, submissionDate, organizer, price, status } = result;

        // upload files to s3
        const filesArray = Object.values(files);
        const allFileUploadedArray = await Promise.all(
          filesArray?.map(async (item) => {
            let location = item.path;
            const originalFileName = item.name;
            const fileType = item.type;
            // uploads file.

            const data = await uploadFiles.upload(
              location,
              originalFileName,
              `${userId}/feeds`
            );
            return {
              url: data.Location,
              type: fileType,
            };
          })
        );
        console.log(`object`, allFileUploadedArray)
        const competition = new Competition({
          title,
          media: allFileUploadedArray,
          user: userId,
          body,
          startDay, 
          submissionDate, 
          organizer, 
          price, 
          status
        });
        // Save post to DB
        const createdCompetition = await competition.save();
        if (!createdCompetition)
          throw createError.InternalServerError(
            "Your request could not be processed. Please contact support or try again after some time."
          );
        res.status(200).json({
          success: true,
          data: createdCompetition,
        });
      } catch (error) {
        next(error);
      }
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = createCompetition;
