# Welcome to Import Service

This service allows you to upload file in s3 bucket and parse it.

Deploy: https://zp16rkpg2b.execute-api.eu-west-1.amazonaws.com/prod/import

## Developing

#### Built With

- [Node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)

## Install dependencies

```shell
cd ImportService

npm install
```

## Tests

The test infrastructure bases on [Jest](https://facebook.github.io/jest/).
Configuration setup is in jest file `jest.config.js`.

### running tests

Unit tests can be run with the following command:

```shell
cd ImportService

npm test
```
