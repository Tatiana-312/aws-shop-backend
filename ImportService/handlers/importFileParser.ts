import { S3Event } from "aws-lambda";
import csv = require("csv-parser");
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const handler = async (event: S3Event) => {
  console.log(`
  EVENT: ${JSON.stringify(event, null, 4)}
  `);

  const result: any = [];

  const key = event.Records[0].s3.object.key;
  const bucket = event.Records[0].s3.bucket.name;

  const s3Client = new S3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const readableStream = (await s3Client.send(getObjectCommand))
    .Body as Readable;

  readableStream
    .pipe(csv())
    .on("data", (data) => {
      result.push(data);
      console.log("RECORD, PARSED PRODUCT", data);
    })
    .on("end", () => {
      console.log("RESULT, ALL PARSED PRODUCTS", result);
    });

  const copyObjectCommand = new CopyObjectCommand({
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: key.replace("uploaded", "parsed"),
  });

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const copyResponse = await s3Client.send(copyObjectCommand);
  const deleteResponse = await s3Client.send(deleteObjectCommand);

  console.log("COPY RESPONSE", copyResponse);
  console.log("DELETE RESPONSE", deleteResponse);
  console.log("File moved from uploaded/ to parsed/ folder successfully");
};
