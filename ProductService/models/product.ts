import { TransactWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { InferType, number, object, string } from "yup";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
}

export type Stock = {
  product_id: string;
  count: number;
};

export interface JoinedProduct extends Product {
  count: number;
}

export interface JoinedCreateResponse {
  product: Product;
  stock: Stock;
  response: TransactWriteCommandOutput;
}

export const bodySchema = object({
  title: string().required().strict(),
  description: string().required().strict(),
  price: number().required().positive(),
  count: number().required().positive(),
});

export type CreateBody = InferType<typeof bodySchema>;
