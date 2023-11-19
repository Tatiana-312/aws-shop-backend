import { products } from "../../mocks/products";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../../utils/buildResponse";

export const getList = async () => {
  return buildResponse(StatusCodes.OK, products);
};
