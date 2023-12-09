import { SQSEvent } from "aws-lambda";
import { create } from "../handlers/create";

export const handler = async (event: SQSEvent) => {
  try {
    for await (const { body } of event.Records) {
      console.log("RECORD BODY", body);
      await create(body);
    }
  } catch (error) {
    console.log(error);
  }
};
