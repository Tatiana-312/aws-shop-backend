import { APIGatewayTokenAuthorizerEvent, PolicyDocument } from "aws-lambda";
import { APIGatewayAuthorizerResult } from "aws-lambda/trigger/api-gateway-authorizer";
import "dotenv/config";

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("event =>", event);

  try {
    if (event.type !== "TOKEN") {
      throw new Error("Unauthorized"); // Return a 401 Unauthorized response
    }
    const authorizationToken = event.authorizationToken;

    const base64Credentials = authorizationToken.split(" ")[1];
    const buffer = Buffer.from(base64Credentials, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");

    console.log(`username: ${username}, password: ${password}`);

    const secretUserPassword = process.env[username];
    const effect =
      !secretUserPassword || secretUserPassword !== password ? "Deny" : "Allow"; // Return a 403 response if Deny

    const generatePolicyDocument = (
      effect: "Allow" | "Deny",
      resource: string
    ) => ({
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    });

    const policyDocument: PolicyDocument = generatePolicyDocument(
      effect,
      event.methodArn
    );

    const response: APIGatewayAuthorizerResult = {
      principalId: base64Credentials,
      policyDocument,
    };

    console.log(`response => ${JSON.stringify(response)}`);

    return response;
  } catch (error) {
    console.log("Invalid auth token. error => ", error);
    throw new Error("Unauthorized"); // Return a 401 Unauthorized response
  }
};
