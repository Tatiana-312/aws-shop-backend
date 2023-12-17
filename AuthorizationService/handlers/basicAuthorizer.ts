import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { APIGatewayAuthorizerResult } from "aws-lambda/trigger/api-gateway-authorizer";
import "dotenv/config";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("event =>", event);

  const generateResponse = (effect: string = "Deny") => ({
    principalId: "principalId",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: event.methodArn,
        },
      ],
    },
  });

  try {
    const authorizationToken = event.authorizationToken;

    const base64Credentials = authorizationToken.split(" ")[1];

    if (!authorizationToken) {
      console.log("Authorization header is not provided");
      throw Error("Unauthorized");
    }

    const buffer = Buffer.from(base64Credentials, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");

    console.log(`username: ${username}, password: ${password}`);

    const secretUserPassword = process.env[username];
    const effect =
      !secretUserPassword || secretUserPassword !== password ? "Deny" : "Allow";

    return generateResponse(effect);
  } catch (error) {
    console.log("Invalid auth token. error => ", error);
    return generateResponse();
  }
};
