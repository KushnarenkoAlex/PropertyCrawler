import express from "express";
import cors from "cors";
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
app.get("/load", async (req, res) => {
  const propertyIds = await loadData();
  res.json(propertyIds);
  return;
});

app.listen(port, () =>
  console.log(`Properties app listening on port ${port}!`)
);
