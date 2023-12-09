export const BUCKET_NAME = "my-import-products-bucket";

export const CORS_ENABLE_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

export enum HttpErrorMessages {
  MISSING_NAME = "Missing file name",
}
