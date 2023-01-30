import AWS from "aws-sdk";
import * as dotenv from 'dotenv'
dotenv.config();

const REGION = process.env.REGION;

const dynamoDB = new AWS.DynamoDB({ region: REGION });
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: REGION,
});
const converter = AWS.DynamoDB.Converter;

export { dynamoDB, documentClient, converter };
