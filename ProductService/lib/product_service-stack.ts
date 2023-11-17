import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class ProductServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "ProductsRestAPI", {
      restApiName: "Product Service",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
      },
    });

    const getProductsList = new NodejsFunction(this, "getProductsList", {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname + "/../resources/lambdas/getProductsList.ts"),
      handler: "handler",
    });

    const getProductsById = new NodejsFunction(this, "getProductsById", {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname + "/../resources/lambdas/getProductsById.ts"),
      handler: "handler",
    });

    const products = api.root.addResource("products");
    const product = products.addResource("{id}");

    const productsIntegration = new LambdaIntegration(getProductsList);
    const productIntegration = new LambdaIntegration(getProductsById);

    products.addMethod("GET", productsIntegration);
    product.addMethod("GET", productIntegration);
  }
}
