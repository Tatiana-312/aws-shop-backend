import {
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const moveParsedFile = async (key: string, bucketName: string) => {
  const s3Client = new S3Client();

  const copyObjectCommand = new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: `${bucketName}/${key}`,
    Key: key.replace("uploaded", "parsed"),
  });

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const copyResponse = await s3Client.send(copyObjectCommand);
  const deleteResponse = await s3Client.send(deleteObjectCommand);

  console.log("COPY RESPONSE", copyResponse);
  console.log("DELETE RESPONSE", deleteResponse);
  console.log("File moved from uploaded/ to parsed/ folder successfully");
};
