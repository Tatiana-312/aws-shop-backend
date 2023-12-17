import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const getObjectStream = async (key: string, bucketName: string) => {
  const s3Client = new S3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const getObjectResponse = await s3Client.send(getObjectCommand);
    return getObjectResponse.Body as Readable;
  } catch (error) {
    console.error(error);

    throw new Error((error as Error).message);
  }
};
