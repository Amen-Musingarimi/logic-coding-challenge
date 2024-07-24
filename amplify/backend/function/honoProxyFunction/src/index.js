/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

const server = awsServerlessExpress.createServer(app.fetch.bind(app));

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context);
};
