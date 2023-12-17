import { APIGatewayProxyEvent } from "aws-lambda";
import { create } from "../handlers/create";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";
import { buildResponse } from "../../utils/buildResponse";

export const handler = async (event: APIGatewayProxyEvent) => {
  const body = event.body;

  console.log(`
  REQUEST: ${event.httpMethod}, ${event.path}
  BODY: ${body}
  `);

  try {
    if (!body) {
      return buildResponse(StatusCodes.BAD_REQUEST, {
        code: StatusCodes.BAD_REQUEST,
        message: HttpErrorMessages.MISSING_BODY,
      });
    }

    return await create(body);
  } catch (error) {
    console.log(error);

    return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, { message: error });
  }
};
