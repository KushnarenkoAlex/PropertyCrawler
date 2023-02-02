import express from "express";
import cors from "cors";
import cron from "node-cron";
import { getAll, getItem } from "./repository.js";
import { loadData } from "./crawler.js";
import { port } from "./config.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/property", async (req, res) => {
  let allItems = await getAll();
  res.json(allItems);
});
app.get("/property/:id", async (req, res) => {
  const id = req.params.id;
  let property = await getItem(id);
  if (property) {
    res.json(property);
    return;
  }

  res.status(404).send("Property not found");
});

cron.schedule("* */30 * * * *", async function () {
  console.log("---------------------");
  console.log("Loading data every 30 seconds");
  await loadData();
});

app.listen(port, () =>
  console.log(`Properties app listening on port ${port}!`)
);
