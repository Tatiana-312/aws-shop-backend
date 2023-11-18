import { APIGatewayProxyEvent } from "aws-lambda";
import { getList } from "../handlers/getList";
import { StatusCodes } from "http-status-codes";
import {
  CORS_ENABLE_HEADERS,
  HttpErrorMessages,
} from "../../constants/constants";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        return await getList();
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
