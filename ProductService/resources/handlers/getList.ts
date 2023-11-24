import "dotenv/config";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../../utils/buildResponse";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { JoinedProduct } from "../../models/product";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getList = async () => {
  const productsCommand = new ScanCommand({
    TableName: process.env.PRODUCTS_TABLE_NAME,
  });

  const stocksCommand = new ScanCommand({
    TableName: process.env.STOCKS_TABLE_NAME,
  });

  const productItems = (await docClient.send(productsCommand)).Items;
  const stockItems = (await docClient.send(stocksCommand)).Items;

  const joinedResult = stockItems?.reduce((resultArr, stock) => {
    const relatedProduct = productItems?.find(
      (product) => stock.product_id === product.id
    );
    const joinedProduct = { ...relatedProduct, count: stock.count };
    resultArr.push(joinedProduct);
    return resultArr;
  }, []);

  return buildResponse(StatusCodes.OK, joinedResult as JoinedProduct[]);
};
