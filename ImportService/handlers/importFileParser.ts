import { S3Event } from "aws-lambda";
import csv = require("csv-parser");
import { moveParsedFile } from "../utils/moveParsedFile";
import { Product } from "../models/types";
import { BUCKET_NAME } from "../constants/constants";
import { getObjectStream } from "../utils/getObjectStream";
import { sendMessageToSqs } from "../utils/sendMessageToSqs";

export const handler = async (event: S3Event) => {
  console.log(`
  EVENT: ${JSON.stringify(event, null, 4)}
  `);

  const products: Product[] = [];

  for await (const record of event.Records) {
    const key = record.s3.object.key;
    const readableStream = await getObjectStream(key, BUCKET_NAME);

    await new Promise((resolve, reject) => {
      readableStream
        .pipe(csv())
        .on("data", (data) => products.push(data))
        .on("end", () => {
          resolve(products);
        })
        .on("error", reject);
    });

    await sendMessageToSqs(products);
    await moveParsedFile(key, BUCKET_NAME);
  }
};
