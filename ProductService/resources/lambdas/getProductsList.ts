import { APIGatewayProxyEvent } from "aws-lambda";
import { getList } from "../handlers/getList";
import { StatusCodes } from "http-status-codes";
import { HttpErrorMessages } from "../../constants/constants";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "GET":
        return await getList();
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
