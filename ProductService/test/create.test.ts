import { create } from "../resources/handlers/create";
import { mockClient } from "aws-sdk-client-mock";
import "aws-sdk-client-mock-jest";
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

const testId = "123456789";

jest.mock("uuid", () => ({ v4: () => testId }));

const ddbMock = mockClient(DynamoDBDocumentClient);
ddbMock.on(TransactWriteCommand).resolves({
  $metadata: {
    httpStatusCode: 200,
    requestId: "0EATHKVFNTA5PK99UEOLA7CKMJVV4KQNSO5AEMVJF66Q9ASUAAJG",
    attempts: 1,
    totalRetryDelay: 0,
  },
});

describe("create", () => {
  test("should send TransactWriteCommand and return success response when valid body", async () => {
    const body =
      '{"title": "Sample Title","description": "Sample Description","price": 42,"count": 10}';

    const successResponse = {
      body: '{"product":{"id":"123456789","title":"Sample Title","description":"Sample Description","price":42},"stock":{"product_id":"123456789","count":10},"response":{"$metadata":{"httpStatusCode":200,"requestId":"0EATHKVFNTA5PK99UEOLA7CKMJVV4KQNSO5AEMVJF66Q9ASUAAJG","attempts":1,"totalRetryDelay":0}}}',
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 201,
    };

    const response = await create(body);

    expect(ddbMock).toHaveReceivedCommandWith(TransactWriteCommand, {
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: {
              id: testId,
              title: "Sample Title",
              description: "Sample Description",
              price: 42,
            },
          },
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: {
              product_id: testId,
              count: 10,
            },
          },
        },
      ],
    });

    expect(response).toEqual(successResponse);
  });

  test("should return validation error when invalid body", async () => {
    const invalidBody =
      '{"description": "Sample Description", "price": 42,"count": 10}';

    const errorResponse = {
      body: '{"code":400,"message":"title is a required field"}',
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 400,
    };

    const response = await create(invalidBody);

    expect(response).toEqual(errorResponse);
  });
});
