import express from "express";
import cors from "cors";
import { getAll, getItem } from "./data.js";
import * as dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = process.env.PORT;

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

app.listen(port, () =>
  console.log(`Properties app listening on port ${port}!`)
);
