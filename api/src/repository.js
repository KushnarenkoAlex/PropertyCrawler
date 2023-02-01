import { dynamoDB, documentClient, converter } from "./dbclient.js";

const tableName = "Property";

export async function getItem(id) {
  try {
    const data = await dynamoDB
      .getItem({
        TableName: tableName,
        Key: {
          Id: {
            S: id,
          },
        },
      })
      .promise();
    return converter.unmarshall(data.Item);
  } catch (err) {
    console.log("Error", err);
  }
}

export async function getAll() {
  try {
    const data = await dynamoDB
      .scan({
        TableName: tableName,
      })
      .promise();
    return data.Items.map((i) => converter.unmarshall(i));
  } catch (err) {
    console.log("Error", err);
  }
}

export async function put(item) {
  try {
    // const mappedItem = converter.marshall(item);
    console.log(item);
    const data = await documentClient
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    console.log(JSON.stringify(data));
  } catch (err) {
    console.log("Error", err);
  }
}
