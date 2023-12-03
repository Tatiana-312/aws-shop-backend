import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent } from "aws-lambda";
import { buildResponse } from "../utils/buildResponse";
import { BUCKET_NAME, HttpErrorMessages } from "../constants/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { StatusCodes } from "http-status-codes";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const fileName = event.queryStringParameters?.name;

    console.log(`REQUEST: 
    Method: ${event.httpMethod},
    Path: ${event.path},
    FileName: ${fileName}`);

    if (!fileName) {
      return buildResponse(StatusCodes.BAD_REQUEST, {
        code: StatusCodes.BAD_REQUEST,
        message: HttpErrorMessages.MISSING_NAME,
      });
    }

    const s3Client = new S3Client();
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `uploaded/${fileName}`,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    console.log("signedURL", signedUrl);

    return buildResponse(StatusCodes.OK, {
      code: StatusCodes.OK,
      signedUrl: signedUrl,
    });
  } catch (error) {
    console.error(error);

    return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
};
