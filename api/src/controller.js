const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./data");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/property", (req, res) => {
  res.json(data);
});
app.get("/property/:id", (req, res) => {
  const id = req.params.id;
  let property = data.find((property) => property.id === parseInt(id));
  if (property) {
    res.json(property);
    return;
  }

  res.status(404).send("Book not found");
});

app.listen(port, () =>
  console.log(`Properties app listening on port ${port}!`)
);
