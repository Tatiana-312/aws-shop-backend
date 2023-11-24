import { HttpErrorMessages } from "../../constants/constants";
import { products } from "../../mocks/products";
import { StatusCodes } from "http-status-codes";
import { buildResponse } from "../../utils/buildResponse";

export const getById = async (id: string) => {
  const result = products.find((product) => product.id === id);

  if (!result) {
    return buildResponse(StatusCodes.NOT_FOUND, {
      code: StatusCodes.NOT_FOUND,
      message: HttpErrorMessages.NOT_FOUND,
    });
  }

  return buildResponse(StatusCodes.OK, result);
};
