import dotenv from "dotenv";
import {
  S3Client,
  S3ClientConfig,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const config: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "aws-access-key-id",
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY || "aws-secret-access-key",
  },
  region: process.env.REGION,
};

export const s3Client = new S3Client(config);

// Create an uploader to a specific bucket
export function s3Uploader(bucket: string) {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: bucket,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        console.log("type", file);
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, uuidv4() + "-" + fileName);
      },
    }),
  });
}

export async function uploadThumbnail(filename: string, data: string) {
  const params = {
    Bucket: process.env.VIDEO_BUCKET,
    Key: filename,
    Body: data,
  };
  s3Client.send(new PutObjectCommand(params));
}

export async function getVideoFile(videoId: string) {
  const params = {
    Bucket: process.env.VIDEO_BUCKET,
    Key: videoId,
  };
  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(params));
    // Convert the ReadableStream to a string.
    return data.Body?.transformToString("base64");
  } catch (err) {
    throw err;
  }
}
