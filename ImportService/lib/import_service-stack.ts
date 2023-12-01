import * as cdk from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
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

    const importProductsFile = new NodejsFunction(this, "importProductsFile", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname + "/../handlers/importProductsFile.ts"),
    });

    const importResource = api.root.addResource("import");

    const importIntegration = new LambdaIntegration(importProductsFile);

    importResource.addMethod("GET", importIntegration);
  }
}
