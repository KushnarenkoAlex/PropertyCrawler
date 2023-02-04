import { load } from "cheerio";
import axios from "axios";
import { putProperty, getAllSubscriptions, getProperty } from "./repository.js";
import { sendNotification } from "./index.js";

export async function loadDataForEachUser() {
  await getAllSubscriptions()
    .then(async (userSubs) => {
      const result = [];
      for (const sub of userSubs) {
        const userId = sub.Id;
        const subs = sub.search_list;
        for (const url of subs) {
          const res = await loadData(url, userId);
          result.push(...res);
        }
        return result;
      }
    })
    .then((newProperties) => {
      for (const newProperty of newProperties) {
        const message = `${newProperty.Address}\n${newProperty.PriceText}\n${newProperty.Link}`;
        console.log(message);
        sendNotification(newProperty.UserId, message);
      }
    })
    .catch((e) => console.log(e));
}

export async function loadData(url, userId) {
  const propertiesToAdd = new Set();
  const newProperties = new Set();

  const pageHTML = await axios.get(url);
  const $ = load(pageHTML.data);
  await Promise.all(
    $("div.propertyCard").each(async (index, element) => {
      const idElement = $(element)
        .find("a")
        .get()
        .find((c) => c.attribs.class == "propertyCard-anchor");
      let id = idElement.attribs.id;

      const priceA = $(element)
        .find("div > div > div > a")
        .get()
        .find(
          (c) =>
            c.attribs.class == "propertyCard-priceLink propertyCard-rentalPrice"
        );
      const priceSpan = $(priceA)
        .find("div > span")
        .get()
        .find((c) => c.attribs.class == "propertyCard-priceValue");

      const propertyLink = priceA.attribs.href;
      const propertyPriceText = $(priceSpan).text();
      const content = $(element)
        .find("div > div > div")
        .get()
        .find((c) => c.attribs.class == "propertyCard-content ");

      const dateSpan = $(content)
        .find("div > div > span")
        .get()
        .find(
          (c) => c.attribs.class == "propertyCard-branchSummary-addedOrReduced"
        );
      const date = $(dateSpan).text();

      const adressMeta = $(content)
        .find("div > a > address > meta")
        .get()
        .find((c) => c.attribs.itemprop == "streetAddress");
      const addressLine = adressMeta.attribs.content;

      if (date === "Added today" || date === "Reduced today") {
        const property = {
          Id: id.slice(4),
          Link: "https://www.rightmove.co.uk" + propertyLink,
          PriceText: propertyPriceText,
          UserId: userId,
          Date: new Date().toLocaleString(),
          Address: addressLine,
        };
        propertiesToAdd.add(property);
      }
    })
  );

  for (const newProp of propertiesToAdd) {
    const existingProp = await getProperty(newProp.Id);
    if (!existingProp.Id) {
      await putProperty(newProp)
        .then(() => {
          newProperties.add(newProp);
        })
        .catch((e) => console.log(e));
    }
  }
  return newProperties;
}
