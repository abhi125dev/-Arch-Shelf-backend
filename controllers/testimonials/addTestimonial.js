const createError = require("http-errors");
const formidable = require("formidable");
const uploadFiles = require("../../services/upload-files");

const Testimonials = require("../../models/Testimonials.model");

const { testimonialValidation } = require("../../services/validation_schema");

const addTestimonial = async (req, res, next) => {
  // try {
  //   const val = req.body;
  //   if (val) {
  //     const newTestimonial = new Testimonials({
  //       name: val.name,
  //       reviews: val.testimonial,
  //     });
  //     newTestimonial.save();
  //     return res.status(200).send(newTestimonial);
  //   }
  // } catch (error) {
  //   console.log("error : ", error);
  // }
  const { _id: userId } = req.user.data;
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw createError.BadRequest(err);
    }

    try {
      const result = await testimonialValidation.validateAsync(fields);
      const { name, testimonial } = result;

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
            `${userId}/testimonials`
          );
          return {
            url: data.Location,
            type: fileType,
          };
        })
      );
      const testimonials = new Testimonials({
        name,
        reviews: testimonial,
        media: allFileUploadedArray[0],
      });
      // Save post to DB
      const createdFeed = await testimonials.save();
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
};

module.exports = addTestimonial;
