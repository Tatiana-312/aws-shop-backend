export const BUCKET_NAME = "my-import-products-bucket";
export const SQS_URL =
  "https://sqs.eu-west-1.amazonaws.com/034133303032/ProductServiceStack-catalogitemssqs92A6EB51-MZfZrluQ5n9t";

export const CORS_ENABLE_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

export enum HttpErrorMessages {
  MISSING_NAME = "Missing file name",
}
