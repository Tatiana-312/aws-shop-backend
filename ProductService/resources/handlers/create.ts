import "dotenv/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { buildResponse } from "../../utils/buildResponse";
import { StatusCodes } from "http-status-codes";
import { CreateBody, bodySchema } from "../../models/product";
import { omit } from "lodash";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const create = async (body: string) => {
  try {
    let validParsedBody: CreateBody;

    try {
      validParsedBody = await bodySchema.validate(JSON.parse(body), {
        strict: true,
      });
    } catch (error) {
      return buildResponse(StatusCodes.BAD_REQUEST, {
        code: StatusCodes.BAD_REQUEST,
        message: (error as Error).message,
      });
    }

    const product = {
      id: uuidv4(),
      ...omit(validParsedBody, ["count"]),
    };

    const stock = {
      product_id: product.id,
      count: validParsedBody.count,
    };

    const transactCommand = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: process.env.PRODUCTS_TABLE_NAME,
            Item: product,
          },
        },
        {
          Put: {
            TableName: process.env.STOCKS_TABLE_NAME,
            Item: stock,
          },
        },
      ],
    });

    const transactResponse = await docClient.send(transactCommand);

    const resultResponse = {
      product: { ...product },
      stock: { ...stock },
      response: { ...transactResponse },
    };

    return buildResponse(StatusCodes.CREATED, resultResponse);
  } catch (error) {
    console.error(error);

    throw new Error((error as Error).message);
  }
};
