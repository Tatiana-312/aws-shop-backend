# Welcome to Product Service

This is a serverless API which allows you to get and create products.

Deploy: https://4y8wnbgpcc.execute-api.eu-west-1.amazonaws.com/prod/

## Developing

#### Built With

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

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
cd ProductService

npm test
```

## Run

To use environments you should rename `.env-test` to `.env`
