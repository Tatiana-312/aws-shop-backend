import { PutCommandOutput } from "@aws-sdk/lib-dynamodb";

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

interface ProductCreateResponse {
  item: Product;
  response: PutCommandOutput;
}
interface StockCreateResponse {
  item: Stock;
  response: PutCommandOutput;
}

export interface JoinedCreateResponse {
  product: ProductCreateResponse;
  stock: StockCreateResponse;
}
