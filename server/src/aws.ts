import dotenv from "dotenv";
import { S3Client, S3ClientConfig, GetObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();
const config: S3ClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.REGION,
};
export const s3Client = new S3Client(config);

export async function getVideoFile(videoId: string) {
  const bucketParams = {
    Bucket: process.env.VIDEO_BUCKET,
    Key: videoId,
  };
  try {
    // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    // Convert the ReadableStream to a string.
    return data.Body?.transformToString("base64");
  } catch (err) {
    throw err;
  }
}
