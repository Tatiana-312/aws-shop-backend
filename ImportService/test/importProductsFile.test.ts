import { handler } from "../handlers/importProductsFile";
import { buildResponse } from "../utils/buildResponse";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StatusCodes } from "http-status-codes";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("../utils/buildResponse");

describe("Test importProductFile lambda", () => {
  const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<
    typeof getSignedUrl
  >;
  const mockBuildResponse = buildResponse as jest.MockedFunction<
    typeof buildResponse
  >;

  const mockEvent: any = {
    httpMethod: "GET",
    path: "/import",
    queryStringParameters: { name: "test-file.csv" },
  };

  beforeEach(() => {
    mockGetSignedUrl.mockClear();
    mockBuildResponse.mockClear();
  });

  it("should return signed URL when provided with a valid file name", async () => {
    mockGetSignedUrl.mockResolvedValue("mocked-signed-url");
    await handler(mockEvent);

    expect(mockBuildResponse).toHaveBeenCalledWith(StatusCodes.OK, {
      code: StatusCodes.OK,
      signedUrl: "mocked-signed-url",
    });

    expect(mockGetSignedUrl).toHaveBeenCalled();
  });

  it("should return a bad request error when the file name is missing", async () => {
    const invalidMockEvent: any = {
      httpMethod: "GET",
      path: "/import",
      queryStringParameters: {},
    };

    await handler(invalidMockEvent);

    expect(mockBuildResponse).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, {
      code: StatusCodes.BAD_REQUEST,
      message: "Missing file name",
    });

    expect(mockGetSignedUrl).not.toHaveBeenCalled();
  });

  it("should return internal server error when an exception occurs", async () => {
    const mockError = new Error("Mocked internal server error");
    mockGetSignedUrl.mockRejectedValue(mockError);

    await handler(mockEvent);

    expect(mockBuildResponse).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: mockError,
      }
    );
  });
});
