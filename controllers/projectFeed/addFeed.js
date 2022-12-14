const createError = require("http-errors");
const formidable = require("formidable");
const fs = require("fs");

// import verify token model and user model
const uploadFiles = require("../../services/upload-files");
const Project = require("../../models/Project.model");

const { feedValidation } = require("../../services/validation_schema");
const { convertStringToArray } = require("../../utils");

const createFeed = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw createError.BadRequest(err);
      }

      try {
        const result = await feedValidation.validateAsync(fields);
        const {
          title,
          body,
          type,
          shortDescription,
          category,
          url,
          architects,
          manufacturers,
          country,
          area,
          clients,
          leadArchitects,
          photographs,
          year,
          materials,
        } = result;

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
              name: originalFileName,
            };
          })
        );
        let feeds = {
          title,
          media: allFileUploadedArray,
          user: userId,
          body,
          type,
          shortDescription,
          category,
          url,
          country,
          area,
          year,
        };
        if (architects) {
          feeds.architects = convertStringToArray(architects);
        }
        if (manufacturers) {
          feeds.manufacturers = convertStringToArray(manufacturers);
        }
        if (clients) {
          feeds.clients = convertStringToArray(clients);
        }
        if (leadArchitects) {
          feeds.leadArchitects = convertStringToArray(leadArchitects);
        }
        if (photographs) {
          feeds.photographs = convertStringToArray(photographs);
        }
        if (materials) {
          feeds.materials = convertStringToArray(materials);
        }
        const feed = new Project(feeds);
        // Save post to DB
        const createdFeed = await feed.save();
        if (!createdFeed)
          throw createError.InternalServerError(
            "Your request could not be processed. Please contact support or try again after some time."
          );
        res.status(200).json({
          success: true,
          data: createdFeed,
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

module.exports = createFeed;
