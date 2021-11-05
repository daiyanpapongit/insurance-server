const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://shova:HUMe3IWgy9wDLebJ@cluster0.ctagf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("insurancePolicy");
      const ageCollection = database.collection("ageGroup");
      const termCollection = database.collection("termGroup");
      const maturityCollection = database.collection("maturityGroup");

    // GET API
    app.get("/loadAges", async (req, res) => {
      const cursor = ageCollection.find({});
      const ages = await cursor.toArray();
      res.send(ages);
    });
    // GET API
    app.get("/loadTerms", async (req, res) => {
      const cursor = termCollection.find({});
      const terms = await cursor.toArray();
      res.send(terms);
    });

    // POST API
    app.post("/ages", async (req, res) => {
      const newAge = req.body;
      const result = await ageCollection.insertOne(newAge);
      console.log("got new Age Group", req.body);
      console.log("added Age Group", result);
      res.json(result);
    });
    // POST API
    app.post("/terms", async (req, res) => {
      const newTerm = req.body;
      const result = await termCollection.insertOne(newTerm);
      console.log("got new Term ", req.body);
      console.log("added Term", result);
      res.json(result);
    });
    // POST API
    app.post("/maturity", async (req, res) => {
      const newMaturity = req.body;
      const result = await maturityCollection.insertOne(newMaturity);
      res.json(result);
    });

      
    app.get('/calc', async (req, res) => {
        const vugichugi = req.query;
        const query = { age: vugichugi.age , term: vugichugi.term  };
        const user = await maturityCollection.findOne(query);
        res.send(user);
    })
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my CRUD Server");
});

app.listen(port, () => {
  console.log("Running Server on port", port);
});
