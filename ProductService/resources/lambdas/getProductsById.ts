import { APIGatewayProxyEvent } from "aws-lambda";
import { getById } from "../handlers/getById";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";

export const handler = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.id;

  if (!productId) {
    return {
      statusCode: StatusCodes.BAD_REQUEST,
      body: JSON.stringify({ message: HttpErrorMessages.MISSING_ID }),
    };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await getById(productId);
      default:
        return {
          statusCode: StatusCodes.BAD_REQUEST,
          body: JSON.stringify({
            message: HttpErrorMessages.INVALID_METHOD_REQUEST,
          }),
        };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: JSON.stringify({ message: error }),
    };
  }
};
