import { load } from "cheerio";
import axios from "axios";
import { put } from "./repository.js";

export async function loadData(maxPages = 50) {
  const paginationURLsToVisit = [
    "https://www.rightmove.co.uk/property-to-rent/find.html?locationIdentifier=REGION%5E93754&sortType=6&savedSearchId=44893972&minBedrooms=1&maxPrice=2500&radius=1.0&index=1&propertyTypes=&mustHave=&dontShow=&includeLetAgreed=false&furnishTypes=",
  ];
  const visitedURLs = [];

  const propertyIds = new Set();

  while (paginationURLsToVisit.length !== 0 && visitedURLs.length <= maxPages) {
    const paginationURL = paginationURLsToVisit.pop();
    const pageHTML = await axios.get(paginationURL);
    visitedURLs.push(paginationURL);
    const $ = load(pageHTML.data);
    $("div.propertyCard").each(async (index, element) => {
      const idElement = $(element)
        .find("a")
        .get()
        .find((c) => c.attribs.class == "propertyCard-anchor");
      let id = idElement.attribs.id;
      // console.log(id);

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
      // console.log(propertyLink);
      const propertyPriceText = $(priceSpan).text();
      // console.log(propertyPriceText);

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
      console.log(date);
      console.log(JSON.stringify(date));

      const adressMeta = $(content)
        .find("div > a > address > meta")
        .get()
        .find((c) => c.attribs.itemprop == "streetAddress");
      const addressLine = adressMeta.attribs.content;
      // console.log(addressLine);

      if (date === "Added today") {
        console.log("Trying to add");
        id = id.slice(4);
        await put({
          Id: id,
          Link: propertyLink,
          PriceText: propertyPriceText,
          Date: new Date().toISOString().slice(0, 10),
          Address: addressLine,
        }).then(() => {
          propertyIds.add(id);
        });
      }
    });
  }
  return propertyIds;
}
