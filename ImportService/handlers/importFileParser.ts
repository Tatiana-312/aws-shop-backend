import { S3Event } from "aws-lambda";
import csv = require("csv-parser");
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { moveParsedFile } from "../utils/moveParsedFile";
import { Product } from "../models/types";

export const handler = async (event: S3Event) => {
  console.log(`
  EVENT: ${JSON.stringify(event, null, 4)}
  `);

  const result: Product[] = [];

  const key = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;

  const s3Client = new S3Client();

  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
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

  await moveParsedFile(s3Client, key, bucketName);
};
