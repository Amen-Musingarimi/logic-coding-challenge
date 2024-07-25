/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const app = require('./app');
const { handle } = require('hono/aws-lambda');

exports.handler = handle(app);
