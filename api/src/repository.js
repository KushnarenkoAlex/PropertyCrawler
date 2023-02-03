import { dynamoDB, documentClient, converter } from "./dbclient.js";

const propertyTableName = "Property";
const subscriptionTableName = "Subscription";

export async function getProperty(id) {
  try {
    const data = await dynamoDB
      .getItem({
        TableName: propertyTableName,
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

export async function getAllProperties() {
  try {
    const data = await dynamoDB
      .scan({
        TableName: propertyTableName,
      })
      .promise();
    return data.Items.map((i) => converter.unmarshall(i));
  } catch (err) {
    console.log("Error", err);
  }
}

export async function putProperty(item) {
  try {
    const data = await documentClient
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    console.log("Saved property");
    console.log(JSON.stringify(data));
  } catch (err) {
    console.log("Error", err);
  }
}

export async function addSubscription(userId, searchUrl) {
  try {
    const params = {
      TableName: tableName,
      Key: {
        Id: userId
      },
      UpdateExpression: `SET #questions = list_append(if_not_exists(#searchList, :empty_list), :value)`,
      ExpressionAttributeNames: {
        '#questions': 'questions'
      },
      ExpressionAttributeValues: {
        ':empty_list': [],
        ':search_url': searchUrl
      }
    };
    const data = await documentClient
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    console.log("Saved property");
    console.log(JSON.stringify(data));
  } catch (err) {
    console.log("Error", err);
  }
}
