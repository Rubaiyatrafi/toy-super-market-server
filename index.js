const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

const categories = require("./data/categories.json");
const toyDetails = require("./data/toydetails.json");

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/categories", (req, res) => {
  res.send(categories);
});
app.get("/toydetails", (req, res) => {
  res.send(toyDetails);
  // console.log(toyDetails);
});

app.get("/toydetails/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(id);
  const singleToy = toyDetails.find((single) => single._id === id);
  res.send(singleToy);
});

app.get("/categories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // console.log(id);
  const toysDetails = toyDetails.filter((single) => single.category_id === id);
  res.send(toysDetails);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
