const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const categories = require("./data/categories.json");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/categories", (req, res) => {
  res.send(categories);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
