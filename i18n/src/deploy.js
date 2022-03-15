import AWS from "aws-sdk";
import fs from "fs";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const metadataFilePath = path.resolve(__dirname, "../dist/metadata.json");
const latestMetadata = JSON.parse(
  fs.readFileSync(metadataFilePath)
);

const latestDeployID = latestMetadata.last_deploy_id;

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const I18N_TARGET_BASE_PATH = latestMetadata.appName;

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const distDirectory = path.resolve(__dirname, "../dist/");
const latestCreatedDistAssetsPath = path.resolve(distDirectory, latestDeployID);

// get file paths
const filePaths = [];
const getFilePaths = (dir) => {
  fs.readdirSync(dir).forEach(function (name) {
    const filePath = path.join(dir, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      filePaths.push(filePath);
    } else if (stat.isDirectory()) {
      getFilePaths(filePath);
    }
  });
};
getFilePaths(latestCreatedDistAssetsPath);
filePaths.push(metadataFilePath);

const uploadFileToS3 = (dir, filePath) => {
    return new Promise((resolve, reject) => {
        const key = I18N_TARGET_BASE_PATH + '/' + filePath.split(`${dir}/`)[1];
        // Setting up S3 upload parameters
        const params = {
          Bucket: BUCKET_NAME,
          Key: key,
          Body: fs.readFileSync(filePath),
        };
      
        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
          if (err) {
            reject(err);
          }
          console.log(`File uploaded successfully. ${data.Location}`);
          resolve(data.Location)
        });
    })

};

const uploadPromises = filePaths.map((path) =>
  uploadFileToS3(distDirectory, path)
);

Promise.all(uploadPromises)
  .then(() => {
    console.log("All files uploaded successfully");
  })
  .catch((err) => console.error(err));
