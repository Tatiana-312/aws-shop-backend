import { CORS_ENABLE_HEADERS } from "../constants/constants";

type Body = any;

export const buildResponse = (statusCode: number, body: Body) => ({
  statusCode: statusCode,
  headers: CORS_ENABLE_HEADERS,
  body: JSON.stringify(body),
});
