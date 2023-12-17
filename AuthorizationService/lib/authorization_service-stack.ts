import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import "dotenv/config";

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaGeneralProps: Partial<NodejsFunctionProps> = {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
    };

    new NodejsFunction(this, "basicAuthorizerLambda", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../handlers/basicAuthorizer.ts"),
      environment: {
        tatiana312: process.env.tatiana312!,
      },
    });
  }
}
