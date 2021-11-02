const fs = require("fs");
const AWS = require("aws-sdk");
const keys = require("../config/keys").aws;
const { v4: uuidv4 } = require("uuid");

//upload file.
exports.upload = (path, originalFileName, modelName, callback) => {
  return new Promise((resolve, reject) => {
    // const originalFileName = files.file.name;
    fs.readFile(path, async function (err, data) {
      if (err) throw err; // Something went wrong!
      const name = originalFileName.split(".");
      const ext = name[name.length - 1];
      name.pop();
      const tempfileName = name.toString();
      const fileName = tempfileName.replace(/,/g, "");

      const s3 = new AWS.S3({
        accessKeyId: keys.accessKeyId,
        secretAccessKey: keys.secretAccessKey,
        region: keys.region,
      });
      const params = {
        Bucket: keys.bucketName,
        Key: modelName + "/" + fileName + "-" + uuidv4() + "." + ext,
        Body: data,
        ACL: "public-read",
      };
      try {
        const data = await s3.upload(params).promise();
        fs.unlink(path, function (err) {
          if (err) {
            console.error(err);
          }
        });
        return resolve(data);
      } catch (error) {
        fs.unlink(path, function (err) {
          if (err) {
            console.error(err);
          }
        });
        reject(error);
        return error;
      }
    });
  });
};
