const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

//
app.use(cors(corsOptions));
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_KEY}@cluster0.p45io4t.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 14,
});

async function run() {
  try {
    const BabyCarCruiseCollation = client
      .db("babyCarCollation")
      .collection("babyCar");

    app.get("/searchByName/:text", async (req, res) => {
      const textSearch = req.params.text;
      // const query =  { $regex: textSearch , $options:'i'}
      const result = await BabyCarCruiseCollation.find({
        toysname: { $regex: textSearch, $options: "i" },
      }).toArray();
      res.send(result);
    });

    app.get("/allCategories", async (req, res) => {
      const query = {};
      const result = await BabyCarCruiseCollation.find(query).toArray();
      res.send(result);
    });

    app.get("/category/:categoryName", async (req, res) => {
      const category = req.params.categoryName;
      const query = { categoryName: category };
      const result = await BabyCarCruiseCollation.find(query).toArray();
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const queryParam = parseInt(req.query.shorts);
      const query = { email: email };
      if (queryParam === 1) {
        const result = await BabyCarCruiseCollation.find(query)
          .sort({ price: 1 })
          .toArray();
        res.send(result);
      } else if (queryParam === -1) {
        const result = await BabyCarCruiseCollation.find(query)
          .sort({ price: -1 })
          .toArray();
        res.send(result);
      } else {
        const result = await BabyCarCruiseCollation.find(query).toArray();
        res.send(result);
      }
    });



    app.get("/categoryDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BabyCarCruiseCollation.findOne(query);
      res.send(result);
    });

    app.post("/category", async (req, res) => {
      const items = req.body;
      const result = await BabyCarCruiseCollation.insertOne(items);
      res.send(result);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BabyCarCruiseCollation.findOne(query);
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      const update = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          price: update.price,
          description: update.description,
          availableQuantity: update.availableQuantity,
        },
      };
      const result = await BabyCarCruiseCollation.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/deletes/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await BabyCarCruiseCollation.deleteOne(query);
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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
  res.send("Baby Toy Car Shop Is Open");
});
app.listen(port, () => {
  console.log(`Toy Car Server Is Running Port ${port}`);
});
