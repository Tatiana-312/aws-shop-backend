import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { Product } from "../models/types";
import { v4 as uuidv4 } from "uuid";
import { SQS_URL } from "../constants/constants";

export const sendMessageToSqs = async (products: Product[]) => {
  const sqsClient = new SQSClient({});

  const entries = products.map((product) => {
    return {
      Id: uuidv4(),
      MessageBody: JSON.stringify(product),
    };
  });

  const sendMessageCommand = new SendMessageBatchCommand({
    QueueUrl: SQS_URL,
    Entries: entries,
  });

  console.log("Sending message to SQS");
  await sqsClient.send(sendMessageCommand);
};
