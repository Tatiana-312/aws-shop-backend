import { handler } from "../resources/lambdas/catalogBatchProcess";
import { create } from "../resources/handlers/create";
import { mockClient } from "aws-sdk-client-mock";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import "aws-sdk-client-mock-jest";

const record = {
  body: '{ "price": "150" }',
};
const mockS3Event = {
  Records: [record],
};

const snsMock = mockClient(SNSClient);
jest.mock("../resources/handlers/create");

describe("CatalogBatchProcess", () => {
  test("should send PublishCommand and call create function", async () => {
    await handler(mockS3Event as any);

    expect(snsMock).toHaveReceivedCommandWith(PublishCommand, {
      Message: record.body,
      MessageAttributes: { price: { DataType: "Number", StringValue: "150" } },
      TopicArn:
        "arn:aws:sns:eu-west-1:034133303032:ProductServiceStack-createproducttopic9DDCCBFF-zuvasN2EYMGn",
    });

    expect(create).toHaveBeenCalledWith(record.body);
  });
});
