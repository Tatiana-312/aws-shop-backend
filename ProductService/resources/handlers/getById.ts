import {
  CORS_ENABLE_HEADERS,
  HttpErrorMessages,
} from "../../constants/constants";
import { products } from "../../mocks/products";
import { StatusCodes } from "http-status-codes";

export const getById = async (id: string) => {
  const result = products.find((product) => product.id === id);

  if (!result) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      body: JSON.stringify({ message: HttpErrorMessages.NOT_FOUND }),
    };
  }

  return {
    statusCode: StatusCodes.OK,
    headers: CORS_ENABLE_HEADERS,
    body: JSON.stringify(result),
  };
};
