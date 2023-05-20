const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const categories = require("./data/categories.json");
const toyDetails = require("./data/toydetails.json");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6pylfvj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

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
