import { CORS_ENABLE_HEADERS } from "../constants/constants";
import { JoinedProduct, Product } from "../models/product";
import { ExceptionData } from "../models/exceptionData";

export const buildResponse = (
  statusCode: number,
  body: JoinedProduct | JoinedProduct[] | ExceptionData
) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
