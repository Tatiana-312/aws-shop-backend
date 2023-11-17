import { CORS_ENABLE_HEADERS } from "../../constants/constants";
import { products } from "../../mocks/products";
import { StatusCodes } from "http-status-codes";

export const getList = async () => {
  return {
    statusCode: StatusCodes.OK,
    headers: CORS_ENABLE_HEADERS,
    body: JSON.stringify(products),
  };
};
