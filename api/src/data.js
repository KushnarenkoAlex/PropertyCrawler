import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbClient } from "./dbclient.js";

export const params = {
    TableName: "PROPERTIES",
    Key: {
      primaryKey: "ID",
      sortKey: "ID",
    },
  };
  
  export const getItem = async () => {
    try {
      const data = await ddbClient.send(new GetCommand(params));
      console.log("Success :", data.Item);
    } catch (err) {
      console.log("Error", err);
    }
  };
