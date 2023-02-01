import AWS from "aws-sdk";
import { region } from "./config.js";

const dynamoDB = new AWS.DynamoDB({ region: region });
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: region,
});
const converter = AWS.DynamoDB.Converter;

export { dynamoDB, documentClient, converter };
