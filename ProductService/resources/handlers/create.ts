import "dotenv/config";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { buildResponse } from "../../utils/buildResponse";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";
import { JoinedProduct } from "../../models/product";
import { omit } from "lodash";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const create = async (body: string | null) => {
  if (!body) {
    return buildResponse(StatusCodes.BAD_REQUEST, {
      code: StatusCodes.BAD_REQUEST,
      message: HttpErrorMessages.MISSING_BODY,
    });
  }

  const parsedBody = JSON.parse(body) as Omit<JoinedProduct, "id">;

  const product = {
    id: uuidv4(),
    ...omit(parsedBody, ["count"]),
  };

  const stock = {
    product_id: product.id,
    count: parsedBody.count,
  };

  const productPutCommand = new PutCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME,
    Item: product,
  });

  const stockPutCommand = new PutCommand({
    TableName: process.env.STOCKS_TABLE_NAME,
    Item: stock,
  });

  const productResponse = await docClient.send(productPutCommand);
  const stockResponse = await docClient.send(stockPutCommand);

  const resultResponse = {
    product: {
      item: { ...product },
      response: { ...productResponse },
    },
    stock: {
      item: { ...stock },
      response: { ...stockResponse },
    },
  };

  return buildResponse(StatusCodes.OK, resultResponse);
};
