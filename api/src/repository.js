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
    await documentClient
      .put({
        TableName: propertyTableName,
        Item: item,
      })
      .promise();
  } catch (err) {
    console.log("Error", err);
  }
}

export async function addSubscription(userId, searchUrl) {
  try {
    const params = {
      TableName: subscriptionTableName,
      Key: {
        Id: userId.toString(),
      },
      UpdateExpression: `SET search_list = list_append(if_not_exists(search_list, :empty_list), :vals)`,
      ExpressionAttributeValues: {
        ":empty_list": [],
        ":vals": [searchUrl],
      },
    };
    const data = await documentClient.update(params).promise();
    console.log(`Subscription for user ${userId} updated`);
  } catch (err) {
    console.log("Error", err);
  }
}

export async function clearSubscriptions(userId) {
  try {
    const params = {
      TableName: subscriptionTableName,
      Key: {
        Id: userId.toString(),
      },
      UpdateExpression: `SET search_list = :empty_list`,
      ExpressionAttributeValues: {
        ":empty_list": [],
      },
    };
    const data = await documentClient.update(params).promise();
    console.log(`Subscription for user ${userId} cleared`);
  } catch (err) {
    console.log("Error", err);
  }
}

export async function getAllSubscriptions() {
  try {
    const data = await dynamoDB
      .scan({
        TableName: subscriptionTableName,
      })
      .promise();
    return data.Items.map((i) => converter.unmarshall(i));
  } catch (err) {
    console.log("Error", err);
  }
}
