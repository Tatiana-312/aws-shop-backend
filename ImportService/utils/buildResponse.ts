import { CORS_ENABLE_HEADERS } from "../constants/constants";
import { ExceptionData } from "../models/exceptionData";
import { ImportResponse } from "../models/types";

type Body = ExceptionData | ImportResponse;

export const buildResponse = (statusCode: number, body: Body) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
