import * as cdk from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import { LambdaDestination } from "aws-cdk-lib/aws-s3-notifications";
import { Construct } from "constructs";
import * as path from "path";

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "ImportAPI", {
      restApiName: "Import Service",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
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

    const importProductsFile = new NodejsFunction(this, "importProductsFile", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname + "/../handlers/importProductsFile.ts"),
    });

    const importFileParser = new NodejsFunction(this, "importFileParser", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname + "/../handlers/importFileParser.ts"),
      role,
    });

    const importResource = api.root.addResource("import");

    const importIntegration = new LambdaIntegration(importProductsFile);

    importResource.addMethod("GET", importIntegration);

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
