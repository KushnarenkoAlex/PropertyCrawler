import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const { REGION, PORT, TOKEN, SERVER_URL } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const WEBHOOK_URL = SERVER_URL + URI;

console.log(REGION);
console.log(PORT);
console.log(TOKEN);
console.log(SERVER_URL);
console.log(TELEGRAM_API);
console.log(URI);
console.log(WEBHOOK_URL);

export { REGION, PORT, TOKEN, SERVER_URL, TELEGRAM_API, WEBHOOK_URL, URI };
