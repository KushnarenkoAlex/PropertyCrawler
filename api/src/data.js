import { dynamoDB, converter } from "./dbclient.js";

const tableName = "Property";

const getItemParams = {
  TableName: tableName,
};

const getAllParams = {
  TableName: tableName,
};

export async function getItem(id) {
  try {
    const data = await dynamoDB
      .getItem({
        ...getItemParams,
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
    const data = await dynamoDB.scan(getAllParams).promise();
    return data.Items.map((i) => converter.unmarshall(i));
  } catch (err) {
    console.log("Error", err);
  }
}
