import express from "express";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
import { addSubscription, clearSubscriptions } from "./repository.js";
import { loadDataForEachUser } from "./crawler.js";
import { PORT, TELEGRAM_API, WEBHOOK_URL, TOKEN } from "./config.js";
import { Telegraf } from "telegraf";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const bot = new Telegraf(TOKEN);

const init = async () => {
  const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  console.log(res.data);
};

bot.command("start", (ctx) => {
  console.log(ctx);
  ctx.reply(
    "Bot to subscribe to Rightmove properties by custom requests\nBasic commands:\n/subscribe {0} - Subscribe to search request\n/remove_subscription - Remove search from subscription\n/clear_subscriptions - Clear all subscriptions\n/help - Help commands"
  );
});

bot.command("help", (ctx) => {
  console.log(ctx);
  ctx.reply(
    "Bot to subscribe to Rightmove properties by custom requests\nBasic commands:\n/subscribe {0} - Subscribe to search request\n/remove_subscription - Remove search from subscription\n/clear_subscriptions - Clear all subscriptions\n/help - Help commands"
  );
});

bot.command("/subscribe", async (ctx) => {
  const messageText = ctx.update.message.text;
  const user = ctx.update.message.from;
  const userId = user.id;
  if (messageText.includes(" ") == 0) {
    ctx.reply("Please provide search link");
  } else {
    const url = messageText.match(/^(\S+)\s(.*)/).slice(1)[1];
    console.log(`Updating user ${userId} subscriptions with ${url}`);
    await addSubscription(userId, url);
    ctx.reply("Subscription added");
  }
});

bot.command("/clear_subscriptions", async (ctx) => {
  const user = ctx.update.message.from;
  const userId = user.id;
  console.log(`Clearing subscriptions for user ${userId}`);
  await clearSubscriptions(userId);
  ctx.reply("Subscriptions cleared");
});

export async function sendNotification(userId, message) {
  bot.telegram.sendMessage(userId, message);
}

bot.launch();

cron.schedule("*/5 * * * *", async function () {
  console.log("---------------------");
  console.log("Loading data every 5 minutes");
  await loadDataForEachUser();
});

app.listen(PORT, async () => {
  console.log(`Properties app listening on port ${PORT}!`);
  await init();
});
