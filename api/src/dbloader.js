import { documentClient } from "./dbclient.js";

const tableName = "Property";

async function load() {
  const data = await documentClient
    .put({
      Item: {
        Id: "2",
        Name: "Dynamo Street 2",
        Price: 800.0,
      },
      TableName: tableName,
    })
    .promise();
  console.log(data.Attributes);
}
load();
