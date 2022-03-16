	
const serverless = require('serverless-http');

const app = require('../server-dist/main').default;
  
module.exports.handler = serverless(app);