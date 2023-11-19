import { APIGatewayProxyEvent } from "aws-lambda";
import { getList } from "../handlers/getList";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";
import { buildResponse } from "../../utils/buildResponse";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        return await getList();
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
