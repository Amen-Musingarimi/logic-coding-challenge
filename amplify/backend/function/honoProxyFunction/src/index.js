const app = require('./app');

exports.handler = async (event) => {
  const { default: awsLambda } = require('aws-lambda');
  return awsLambda.handler(event, app.fetch.bind(app));
};
