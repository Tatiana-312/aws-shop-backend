# AWS-SHOP-BACKEND

This project is a monorepo which contains the backend services.

## Services

- [Product Service](#product-service)
- **_..._**

## Swagger

This documentation will provide you with an overview of all the available endpoints, their required parameters, and the response structure.

#### Usage

To use API Documentation you need to copy `openApi.yaml` file, and past it to the https://editor.swagger.io/.

# Product Service

Deploy: https://k1pea3ah5c.execute-api.eu-west-1.amazonaws.com/prod/

## Developing

#### Built With

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)

## Install dependencies

```shell
cd ProductService

npm install
```

## Tests

The test infrastructure bases on [Jest](https://facebook.github.io/jest/).
Configuration setup is in jest file `jest.config.js`.

### running tests

Unit tests can be run with the following command:

```shell
npm run test
```
