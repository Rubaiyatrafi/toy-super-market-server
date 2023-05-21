const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    const toysCollection = client.db("toysDB").collection("toys");

    // app.get("/toystore", async (req, res) => {
    //   const cursor = toysCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });
    app.get("/toystore", async (req, res) => {
      const query = {};
      const cursor = toysCollection.find(query).limit(20);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/mytoys/:email", async (req, res) => {
      let query = { email: req.params.email };
      const result = await toysCollection.find(query).toArray();
      res.send(result);
      console.log("my toy: ", result);
    });

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToys = req.body;
      const toys = {
        $set: {
          name: updateToys.name,
          photo: updateToys.photo,
          seller: updateToys.seller,
          email: updateToys.email,
          category: updateToys.category,
          quantity: updateToys.quantity,
          price: updateToys.price,
          ratings: updateToys.ratings,
          description: updateToys.description,
        },
      };
      const result = await toysCollection.updateOne(filter, toys, options);
      res.send(result);
    });

    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // app.get("/toystore/:email", async (req, res) => {
    //   let query = { email: req.query.email };
    //   const result = await toysCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get("/toystore/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.post("/toystore", async (req, res) => {
      const newToys = req.body;
      // console.log(newToys);
      const result = await toysCollection.insertOne(newToys);
      res.send(result);
    });

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
