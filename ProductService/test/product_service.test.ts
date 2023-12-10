import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ProductServiceStack } from "../lib/product_service-stack";

describe("ProductServiceStack", () => {
  let template: Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new ProductServiceStack(app, "MyTestStack");
    template = Template.fromStack(stack);
  });

  test("Stack Contains Four Lambda Functions And One Api Gateway", () => {
    template.resourceCountIs("AWS::Lambda::Function", 4);
    template.resourceCountIs("AWS::ApiGateway::RestApi", 1);
  });

  test("API Gateway Created With Correct Name", () => {
    template.hasResourceProperties("AWS::ApiGateway::RestApi", {
      Name: "Product Service",
    });
  });

  test("API Gateway Has Resources With Correct Paths", () => {
    template.hasResourceProperties("AWS::ApiGateway::Resource", {
      PathPart: "products",
    });
    template.hasResourceProperties("AWS::ApiGateway::Resource", {
      PathPart: "{id}",
    });
  });

  test("API Gateway Has Method That Triggers getProductsList Lambda Function", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "GET",
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS_PROXY",
        Uri: {
          "Fn::Join": [
            "",
            [
              "arn:",
              { Ref: "AWS::Partition" },
              ":apigateway:",
              { Ref: "AWS::Region" },
              ":lambda:path/2015-03-31/functions/",
              { "Fn::GetAtt": ["getProductsList1F4CE4F4", "Arn"] },
              "/invocations",
            ],
          ],
        },
      },
    });
  });

  test("API Gateway Has Method That Triggers getProductsById Lambda Function", () => {
    template.hasResourceProperties("AWS::ApiGateway::Method", {
      HttpMethod: "GET",
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS_PROXY",
        Uri: {
          "Fn::Join": [
            "",
            [
              "arn:",
              { Ref: "AWS::Partition" },
              ":apigateway:",
              { Ref: "AWS::Region" },
              ":lambda:path/2015-03-31/functions/",
              { "Fn::GetAtt": ["getProductsById008BCA51", "Arn"] },
              "/invocations",
            ],
          ],
        },
      },
    });
  });

  test("Lambdas Have Correct Properties", () => {
    template.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs18.x",
    });
  });
});
