import { CORS_ENABLE_HEADERS } from "../constants/constants";
import { JoinedProduct, Product } from "../models/product";
import { ExceptionData } from "../models/exceptionData";

export const buildResponse = (
  statusCode: number,
  body:
    | Product
    | JoinedProduct[]
    | ExceptionData
    | Record<string, string | number>[]
    | undefined
) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
