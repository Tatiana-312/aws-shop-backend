import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { products } from "../../mocks/products";
import { stocks } from "../../mocks/stocks";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const main = async () => {
  const putProductRequests = products.map(
    ({ id, title, description, price }) => ({
      PutRequest: {
        Item: {
          id: id,
          title: title,
          description: description,
          price: price,
        },
      },
    })
  );

  const putStockRequests = stocks.map(({ product_id, count }) => ({
    PutRequest: {
      Item: {
        product_id: product_id,
        count: count,
      },
    },
  }));

  const writeProductsCommand = new BatchWriteCommand({
    RequestItems: {
      ["products"]: putProductRequests,
    },
  });

  const writeStocksCommand = new BatchWriteCommand({
    RequestItems: {
      ["stocks"]: putStockRequests,
    },
  });

  await docClient.send(writeProductsCommand);
  await docClient.send(writeStocksCommand);
};

main();
