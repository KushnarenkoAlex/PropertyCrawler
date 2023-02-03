import express from "express";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
// import { getAll, getItem } from "./repository.js";
import { loadData } from "./crawler.js";
import { PORT, TELEGRAM_API, WEBHOOK_URL, URI, TOKEN } from "./config.js";
import { Telegraf } from "telegraf";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const bot = new Telegraf(process.env.TOKEN);

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
bot.command("/subscribe", (ctx) => {
  console.log(ctx);
  const messageText = ctx.update.message.text;
  const commands = messageText.split(" ");
  if (commands.length < 2) {
    ctx.reply("Please provide search link");
  }
  ctx.reply(commands[1]);
});

bot.launch();

// app.post(URI, async (req, res) => {
//   console.log(req.body);

//   const chatId = req.body.message.chat.id;
//   const text = req.body.message.text;
//   const userId = req.body.message.from.id;

//   await axios.post(`${TELEGRAM_API}/sendMessage`, {
//     chat_id: chatId,
//     text: text,
//   });
//   return res.send();
// });

// app.get("/property", async (_req, res) => {
//   let allItems = await getAll();
//   res.json(allItems);
// });

// app.get("/property/:id", async (req, res) => {
//   const id = req.params.id;
//   let property = await getItem(id);
//   if (property) {
//     res.json(property);
//     return;
//   }

//   res.status(404).send("Property not found");
// });

cron.schedule("* */30 * * * *", async function () {
  console.log("---------------------");
  console.log("Loading data every 30 minutes");
  await loadData();
});

app.listen(PORT, async () => {
  console.log(`Properties app listening on port ${PORT}!`);
  await init();
});
