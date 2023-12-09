export const CORS_ENABLE_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};

export const SNS_ARN =
  "arn:aws:sns:eu-west-1:034133303032:ProductServiceStack-createproducttopic9DDCCBFF-zuvasN2EYMGn";

export enum Emails {
  HIGHT_PRICE = "tatyanapetrosh@gmail.com",
  LOW_PRICE = "tatyanapetrosh2@gmail.com",
}

export enum HttpErrorMessages {
  NOT_FOUND = "Product not found",
  INVALID_METHOD_REQUEST = "Invalid HTTP method",
  MISSING_ID = "Missing path parameter: id",
  MISSING_BODY = "Missing body",
}
