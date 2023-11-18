import { APIGatewayProxyEvent } from "aws-lambda";
import { getById } from "../handlers/getById";
import { StatusCodes } from "http-status-codes";
import {
  CORS_ENABLE_HEADERS,
  HttpErrorMessages,
} from "../../constants/constants";

export const handler = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.id;

  if (!productId) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: CORS_ENABLE_HEADERS,
      body: JSON.stringify({
        code: StatusCodes.BAD_REQUEST,
        message: HttpErrorMessages.MISSING_ID,
      }),
    };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await getById(productId);
      default:
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          headers: CORS_ENABLE_HEADERS,
          body: JSON.stringify({
            code: StatusCodes.BAD_REQUEST,
            message: HttpErrorMessages.INVALID_METHOD_REQUEST,
          }),
        };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: CORS_ENABLE_HEADERS,
      body: JSON.stringify({ message: error }),
    };
  }
};
