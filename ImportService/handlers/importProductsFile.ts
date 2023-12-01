import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent } from "aws-lambda";
import { buildResponse } from "../utils/buildResponse";
import { HttpErrorMessages } from "../constants/constants";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const fileName = event.queryStringParameters?.name;

    console.log(`REQUEST: 
    Method: ${event.httpMethod},
    Path: ${event.path},
    FileName: ${fileName}`);

    if (!fileName) {
      return buildResponse(400, {
        code: 400,
        message: HttpErrorMessages.MISSING_NAME,
      });
    }

    const s3Client = new S3Client();
    const command = new GetObjectCommand({
      Bucket: "my-import-products-bucket",
      Key: `uploaded/${fileName}`,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    console.log("signedUrl", signedUrl);

    return buildResponse(200, {
      code: 200,
      signedUrl: signedUrl,
    });
  } catch (error) {
    console.error(error);

    return buildResponse(500, {
      code: 500,
      message: "Internal Server Error",
    });
  }
};
