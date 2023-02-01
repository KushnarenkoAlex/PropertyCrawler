import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const region = process.env.REGION;
const port = process.env.PORT;

console.log(region);
console.log(port);
export { region, port };
