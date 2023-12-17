import * as cdk from "aws-cdk-lib";
import {
  AuthorizationType,
  Cors,
  IdentitySource,
  LambdaIntegration,
  ResponseType,
  RestApi,
  TokenAuthorizer,
} from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime, Function } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Construct } from "constructs";
import { join } from "path";
import "dotenv/config";
import { Duration } from "aws-cdk-lib";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "ImportAPI", {
      restApiName: "Import Service",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    api.addGatewayResponse("GatewayResponse4XX", {
      type: cdk.aws_apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers":
          "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "Access-Control-Allow-Methods": "'OPTIONS,GET,PUT'",
      },
    });

    const role = new Role(this, "sqsAccess", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["sqs:*", "logs:*"],
        resources: ["*"],
      })
    );

    const lambdaGeneralProps: Partial<NodejsFunctionProps> = {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
    };

    const importProductsFile = new NodejsFunction(this, "importProductsFile", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../handlers/importProductsFile.ts"),
    });

    const importFileParser = new NodejsFunction(this, "importFileParser", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../handlers/importFileParser.ts"),
      role,
    });

    const basicAuthorizer = Function.fromFunctionArn(
      this,
      "basicAuthorizerLambda",
      process.env.AUTHORIZER_LAMBDA_ARN!
    );

    const assumeRole = new Role(this, "TokenAuthorizerRole", {
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
    });

    assumeRole.addToPolicy(
      new PolicyStatement({
        actions: ["lambda:InvokeFunction"],
        resources: [process.env.AUTHORIZER_LAMBDA_ARN!],
      })
    );

    const authorizer = new TokenAuthorizer(this, "basicAuthorizer", {
      handler: basicAuthorizer,
      identitySource: IdentitySource.header("authorization"),
      resultsCacheTtl: Duration.seconds(0),
      assumeRole,
    });

    const importResource = api.root.addResource("import");

    const importIntegration = new LambdaIntegration(importProductsFile);

    importResource.addMethod("GET", importIntegration, {
      authorizer,
      authorizationType: AuthorizationType.CUSTOM,
    });

    const s3Bucket = Bucket.fromBucketName(
      this,
      "ImportProductsBucket",
      "my-import-products-bucket"
    );

    s3Bucket.addEventNotification(
      EventType.OBJECT_CREATED,
      new LambdaDestination(importFileParser),
      { prefix: "uploaded/" }
    );
  }
}
