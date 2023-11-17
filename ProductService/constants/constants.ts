const CLOUDFRONT_PATH = "https://dbo158o6tyb1p.cloudfront.net";

export const CORS_ENABLE_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": CLOUDFRONT_PATH,
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

export enum HttpErrorMessages {
  NOT_FOUND = "Product not found",
  INVALID_METHOD_REQUEST = "Invalid HTTP method",
  MISSING_ID = "Missing path parameter: id",
}
