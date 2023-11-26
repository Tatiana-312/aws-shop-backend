import { APIGatewayProxyEvent } from "aws-lambda";
import { getById } from "../handlers/getById";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";
import { buildResponse } from "../../utils/buildResponse";

export const handler = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.id;

  console.log(`
  REQUEST: ${event.httpMethod}, ${event.path}
  ID: ${productId}
  `);

  if (!productId) {
    return buildResponse(StatusCodes.BAD_REQUEST, {
      code: StatusCodes.BAD_REQUEST,
      message: HttpErrorMessages.MISSING_ID,
    });
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await getById(productId);
      default:
        return buildResponse(StatusCodes.BAD_REQUEST, {
          code: StatusCodes.BAD_REQUEST,
          message: HttpErrorMessages.INVALID_METHOD_REQUEST,
        });
    }
  } catch (error) {
    console.error(error);

    return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, { message: error });
  }
};
