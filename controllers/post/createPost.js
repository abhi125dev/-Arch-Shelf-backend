const createError = require("http-errors");
const formidable = require("formidable");

// import verify token model and user model
const uploadFiles = require("../../services/upload-files");
const Post = require("../../models/Post.model");
const User = require("../../models/User.model");
const Subscription = require("../../models/Subscription.model");

const { createPostValidation } = require("../../services/validation_schema");

const createPost = async (req, res, next) => {
  try {
    const { _id: userId } = req.user.data;

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(400);
        res.send(err);
      }

      try {
        const result = await createPostValidation.validateAsync(fields);
        const { name, price, type } = result;

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
              `users/${userId}/posts`
            );
            return {
              url: data.Location,
              type: fileType,
            };
          })
        );

        // const subscriptionList = await Subscription.find({subscription_to: userId}, "_id");

        const post = new Post({
          name,
          media: allFileUploadedArray,
          user: userId,
          price,
          type,
          auth_group: [],
        });

        // Save post to DB
        const createdPost = await post.save();
        if (!createdPost)
          throw createError.InternalServerError(
            "Your request could not be processed. Please contact support or try again after some time."
          );
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { posts: createdPost._id } }
        );
        res.status(200).json({
          success: true,
          data: createdPost,
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

module.exports = createPost;
