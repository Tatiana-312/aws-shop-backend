import { SQSEvent } from "aws-lambda";
import { create } from "../handlers/create";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { SNS_ARN } from "../../constants/constants";

const snsClient = new SNSClient({});

export const handler = async (event: SQSEvent) => {
  try {
    for await (const { body } of event.Records) {
      const publishCommand = new PublishCommand({
        Message: body,
        TopicArn: SNS_ARN,
        MessageAttributes: {
          price: {
            DataType: "Number",
            StringValue: `${JSON.parse(body).price}`,
          },
        },
      });

      await create(body);
      await snsClient.send(publishCommand);
    }
  } catch (error) {
    console.log(error);
  }
};
