import { products } from "../../mocks/products";

export const getById = async (id: string) => {
  const result = products.find((product) => product.id === id);

  if (!result) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "https://dbo158o6tyb1p.cloudfront.net",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    },
    body: JSON.stringify(result),
  };
};
