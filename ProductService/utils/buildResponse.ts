import { CORS_ENABLE_HEADERS } from "../constants/constants";
import { Product } from "../models/product";
import { ExceptionData } from "../models/exceptionData";

export const buildResponse = (
  statusCode: number,
  body: Product | Product[] | ExceptionData
) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
