var AWS = require("aws-sdk");
require("dotenv").config();

const REGION = process.env.REGION;

console.log(REGION);

const dynamoDB = new AWS.DynamoDB({ region: REGION });
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: REGION,
});

module.exports = { dynamoDB, documentClient };
