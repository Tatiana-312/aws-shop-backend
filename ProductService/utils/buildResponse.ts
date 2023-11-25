import { CORS_ENABLE_HEADERS } from "../constants/constants";
import { JoinedCreateResponse, JoinedProduct } from "../models/product";
import { ExceptionData } from "../models/exceptionData";

type BodyType =
  | JoinedProduct
  | JoinedProduct[]
  | ExceptionData
  | JoinedCreateResponse;

export const buildResponse = (statusCode: number, body: BodyType) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
