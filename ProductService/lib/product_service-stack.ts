import "dotenv/config";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Topic } from "aws-cdk-lib/aws-sns";

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

    const role = new Role(this, "dynamodbAccessRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });

    role.addToPolicy(
      new PolicyStatement({
        actions: ["dynamodb:*", "logs:*"],
        resources: ["*"],
      })
    );

    const lambdaGeneralProps: Partial<NodejsFunctionProps> = {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      environment: {
        PRODUCTS_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME!,
        STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME!,
      },
      role,
    };

    const getProductsList = new NodejsFunction(this, "getProductsList", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../resources/lambdas/getProductsList.ts"),
    });

    const getProductsById = new NodejsFunction(this, "getProductsById", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../resources/lambdas/getProductsById.ts"),
    });

    const createProduct = new NodejsFunction(this, "createProduct", {
      ...lambdaGeneralProps,
      entry: join(__dirname + "/../resources/lambdas/createProduct.ts"),
    });

    const catalogBatchProcess = new NodejsFunction(
      this,
      "catalogBatchProcess",
      {
        ...lambdaGeneralProps,
        entry: join(__dirname + "/../resources/lambdas/catalogBatchProcess.ts"),
      }
    );

    const catalogItemsQueue = new Queue(this, "catalog-items-sqs");

    const catalogItemsQueuePolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      principals: [new ServicePrincipal("lambda.amazonaws.com")],
      actions: ["sqs:SendMessage", "sqs:ReceiveMessage"],
      resources: ["*"],
    });

    catalogItemsQueue.addToResourcePolicy(catalogItemsQueuePolicy);

    catalogBatchProcess.addEventSource(
      new SqsEventSource(catalogItemsQueue, {
        batchSize: 5,
      })
    );

    // const createProductTopic = new Topic(this, "create-product-topic");

    // createProductTopic.addSubscription();

    const products = api.root.addResource("products");
    const product = products.addResource("{id}");

    const productsIntegration = new LambdaIntegration(getProductsList);
    const productIntegration = new LambdaIntegration(getProductsById);
    const createProductIntegration = new LambdaIntegration(createProduct);

    products.addMethod("GET", productsIntegration);
    products.addMethod("POST", createProductIntegration);
    product.addMethod("GET", productIntegration);
  }
}
