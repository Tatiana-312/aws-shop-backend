import "dotenv/config";
import { HttpErrorMessages } from "../../constants/constants";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../../utils/buildResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { JoinedProduct } from "../../models/product";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getById = async (id: string) => {
  const productsCommand = new QueryCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME,
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: { ":id": id },
  });

  const stocksCommand = new QueryCommand({
    TableName: process.env.STOCKS_TABLE_NAME,
    KeyConditionExpression: "product_id = :product_id",
    ExpressionAttributeValues: { ":product_id": id },
  });

  const product = await docClient.send(productsCommand);
  const stock = await docClient.send(stocksCommand);

  if (!product.Items?.length || !stock.Items?.length) {
    return buildResponse(StatusCodes.NOT_FOUND, {
      code: StatusCodes.NOT_FOUND,
      message: HttpErrorMessages.NOT_FOUND,
    });
  }
  const joinedProduct = { ...product.Items[0], count: stock.Items[0].count };

  return buildResponse(StatusCodes.OK, joinedProduct as JoinedProduct);
};
