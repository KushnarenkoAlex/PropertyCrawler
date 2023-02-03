import AWS from "aws-sdk";
import { REGION } from "./config.js";

const dynamoDB = new AWS.DynamoDB({ region: REGION });
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: REGION,
});
const converter = AWS.DynamoDB.Converter;

export { dynamoDB, documentClient, converter };
